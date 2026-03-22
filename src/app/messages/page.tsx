"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers";
import { db } from "@/lib/firebase";
import {
    collection, query, where, orderBy, onSnapshot, addDoc,
    serverTimestamp, doc, getDoc, updateDoc, limit
} from "firebase/firestore";
import Link from "next/link";

interface Conversation {
    id: string;
    participants: string[];
    participantNames: Record<string, string>;
    participantTypes: Record<string, string>;
    jobId?: string;
    jobTitle?: string;
    lastMessage?: string;
    lastMessageAt?: any;
    unreadCount: Record<string, number>;
}

interface Message {
    id: string;
    conversationId: string;
    senderId: string;
    senderName: string;
    senderType: "teen" | "employer";
    content: string;
    createdAt: any;
}

const MOCK_CONVERSATIONS: Conversation[] = [];
const MOCK_MESSAGES: Message[] = [];

export default function MessagesPage() {
    const { user, loading: authLoading, userType } = useAuth();
    const router = useRouter();
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [messages, setMessages] = useState<Message[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (!user || !db) return;

        // Capture db in local variable to fix TypeScript narrowing
        const firestore = db;

        // Subscribe to conversations
        const convQuery = query(
            collection(firestore, "conversations"),
            where("participants", "array-contains", user.uid),
            orderBy("lastMessageAt", "desc")
        );

        const unsubscribe = onSnapshot(convQuery, async (snapshot) => {
            const convs: Conversation[] = [];

            for (const docSnap of snapshot.docs) {
                const data = docSnap.data();

                // Get participant names
                const participantNames: Record<string, string> = {};
                const participantTypes: Record<string, string> = {};

                for (const pid of data.participants || []) {
                    if (pid === user.uid) continue;
                    try {
                        const userDoc = await getDoc(doc(firestore, "users", pid));
                        if (userDoc.exists()) {
                            const ud = userDoc.data();
                            participantNames[pid] = ud.firstName ? `${ud.firstName} ${ud.lastName}` : ud.companyName || "User";
                            participantTypes[pid] = ud.userType || "teen";
                        }
                    } catch (e) {
                        participantNames[pid] = "User";
                    }
                }

                convs.push({
                    id: docSnap.id,
                    participants: data.participants || [],
                    participantNames,
                    participantTypes,
                    jobId: data.jobId,
                    jobTitle: data.jobTitle,
                    lastMessage: data.lastMessage,
                    lastMessageAt: data.lastMessageAt,
                    unreadCount: data.unreadCount || {}
                });
            }

            setConversations(convs);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user]);

    useEffect(() => {
        if (!selectedConversation || !db) return;

        const firestore = db;

        const msgQuery = query(
            collection(firestore, "messages"),
            where("conversationId", "==", selectedConversation.id),
            orderBy("createdAt", "asc"),
            limit(100)
        );

        const unsubscribe = onSnapshot(msgQuery, (snapshot) => {
            const msgs: Message[] = [];
            snapshot.forEach(doc => {
                const data = doc.data();
                msgs.push({
                    id: doc.id,
                    conversationId: data.conversationId,
                    senderId: data.senderId,
                    senderName: data.senderName || "User",
                    senderType: data.senderType,
                    content: data.content,
                    createdAt: data.createdAt
                });
            });
            setMessages(msgs);

            // Scroll to bottom
            setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        });

        return () => unsubscribe();
    }, [selectedConversation]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !selectedConversation || !user || !db) return;

        const firestore = db;
        setSending(true);
        try {
            // Get sender name
            const userDoc = await getDoc(doc(firestore, "users", user.uid));
            const senderName = userDoc.exists()
                ? (userDoc.data().firstName ? `${userDoc.data().firstName} ${userDoc.data().lastName}` : userDoc.data().companyName)
                : "User";

            // Add message
            await addDoc(collection(firestore, "messages"), {
                conversationId: selectedConversation.id,
                senderId: user.uid,
                senderName,
                senderType: userType,
                content: newMessage.trim(),
                isFlagged: false,
                moderatedBy: "ai",
                visibleTo: selectedConversation.participants,
                createdAt: serverTimestamp()
            });

            // Update conversation
            const otherParticipant = selectedConversation.participants.find(p => p !== user.uid) || "";
            await updateDoc(doc(firestore, "conversations", selectedConversation.id), {
                lastMessage: newMessage.trim(),
                lastMessageAt: serverTimestamp(),
                [`unreadCount.${otherParticipant}`]: (selectedConversation.unreadCount[otherParticipant] || 0) + 1
            });

            setNewMessage("");
        } catch (error) {
            console.error("Error sending message:", error);
        } finally {
            setSending(false);
        }
    };

    const startConversation = async (otherUserId: string, jobId?: string, jobTitle?: string) => {
        if (!user || !db) return;

        const firestore = db;

        // Check if conversation exists
        const existingQuery = query(
            collection(firestore, "conversations"),
            where("participants", "array-contains", user.uid)
        );

        // For now, create new conversation
        const convRef = await addDoc(collection(firestore, "conversations"), {
            participants: [user.uid, otherUserId],
            jobId: jobId || null,
            jobTitle: jobTitle || null,
            lastMessage: null,
            lastMessageAt: serverTimestamp(),
            unreadCount: { [otherUserId]: 0 }
        });

        // Navigate to conversation
        setSelectedConversation({
            id: convRef.id,
            participants: [user.uid, otherUserId],
            participantNames: {},
            participantTypes: {},
            jobId,
            jobTitle,
            unreadCount: {}
        });
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
            </div>
        );
    }

    // Use mock data for demo
    const displayConversations = conversations.length > 0 ? conversations : MOCK_CONVERSATIONS;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
            {/* Header */}
            <header className="bg-slate-800/50 border-b border-slate-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-woork-teal">woork</span>
                        </Link>
                        <Link href="/dashboard" className="text-slate-400 hover:text-white">
                            ← Back to Dashboard
                        </Link>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <h1 className="text-2xl font-bold text-white mb-6">Messages</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Conversations List */}
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden">
                        <div className="p-4 border-b border-slate-700">
                            <h2 className="font-semibold text-white">Conversations</h2>
                        </div>

                        <div className="divide-y divide-slate-700 max-h-[600px] overflow-y-auto">
                            {displayConversations.length === 0 ? (
                                <div className="p-8 text-center">
                                    <div className="text-4xl mb-3">💬</div>
                                    <p className="text-slate-400">No conversations yet</p>
                                    <p className="text-slate-500 text-sm mt-1">Start by applying to jobs or posting a job</p>
                                </div>
                            ) : (
                                displayConversations.map(conv => {
                                    const otherUserId = conv.participants.find(p => p !== user?.uid);
                                    const otherName = conv.participantNames[otherUserId || ""] || "User";
                                    const otherType = conv.participantTypes[otherUserId || ""] || "teen";
                                    const isUnread = (conv.unreadCount[user?.uid || ""] || 0) > 0;

                                    return (
                                        <button
                                            key={conv.id}
                                            onClick={() => setSelectedConversation(conv)}
                                            className={`w-full p-4 text-left hover:bg-slate-700/30 transition-colors ${selectedConversation?.id === conv.id ? "bg-slate-700/50" : ""
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${otherType === "employer" ? "bg-woork-coral/20 text-woork-coral" : "bg-woork-teal/20 text-woork-teal"
                                                    }`}>
                                                    {otherName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center justify-between">
                                                        <span className={`font-medium ${isUnread ? "text-white" : "text-slate-300"}`}>
                                                            {otherName}
                                                        </span>
                                                        {isUnread && (
                                                            <span className="w-2 h-2 bg-woork-teal rounded-full"></span>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-slate-500 capitalize">{otherType}</div>
                                                    {conv.jobTitle && (
                                                        <div className="text-xs text-woork-teal truncate">{conv.jobTitle}</div>
                                                    )}
                                                    {conv.lastMessage && (
                                                        <p className="text-sm text-slate-500 truncate mt-1">{conv.lastMessage}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl border border-slate-700 overflow-hidden flex flex-col">
                        {selectedConversation ? (
                            <>
                                {/* Chat Header */}
                                <div className="p-4 border-b border-slate-700">
                                    <div className="flex items-center gap-3">
                                        {(() => {
                                            const otherUserId = selectedConversation.participants.find(p => p !== user?.uid);
                                            const otherName = selectedConversation.participantNames[otherUserId || ""] || "User";
                                            const otherType = selectedConversation.participantTypes[otherUserId || ""] || "teen";
                                            return (
                                                <>
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${otherType === "employer" ? "bg-woork-coral/20 text-woork-coral" : "bg-woork-teal/20 text-woork-teal"
                                                        }`}>
                                                        {otherName.split(" ").map(n => n[0]).join("").slice(0, 2)}
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-white">{otherName}</div>
                                                        <div className="text-xs text-slate-500 capitalize">{otherType}</div>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                    {selectedConversation.jobTitle && (
                                        <div className="mt-2 text-sm text-woork-teal">
                                            Re: {selectedConversation.jobTitle}
                                        </div>
                                    )}
                                </div>

                                {/* Messages */}
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
                                    {messages.length === 0 ? (
                                        <div className="text-center text-slate-500 py-8">
                                            No messages yet. Start the conversation!
                                        </div>
                                    ) : (
                                        messages.map(msg => {
                                            const isMe = msg.senderId === user?.uid;
                                            return (
                                                <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                                    <div className={`max-w-[70%] ${isMe
                                                        ? "bg-woork-teal text-white rounded-2xl rounded-br-md"
                                                        : "bg-slate-700 text-slate-200 rounded-2xl rounded-bl-md"
                                                        } px-4 py-2`}>
                                                        <p className="text-sm">{msg.content}</p>
                                                        <p className={`text-xs mt-1 ${isMe ? "text-teal-200" : "text-slate-500"}`}>
                                                            {msg.createdAt?.toDate?.()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || "Just now"}
                                                        </p>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Message Input */}
                                <form onSubmit={sendMessage} className="p-4 border-t border-slate-700">
                                    <div className="flex gap-3">
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-slate-700/50 border border-slate-600 rounded-xl px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-woork-teal"
                                        />
                                        <button
                                            type="submit"
                                            disabled={sending || !newMessage.trim()}
                                            className="px-6 py-3 bg-woork-teal text-white rounded-xl hover:bg-woork-teal/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {sending ? "..." : "Send"}
                                        </button>
                                    </div>
                                </form>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="text-6xl mb-4">💬</div>
                                    <h3 className="text-xl font-medium text-white mb-2">Select a Conversation</h3>
                                    <p className="text-slate-400">Choose a conversation from the list to start messaging</p>

                                    {userType === "employer" && (
                                        <Link
                                            href="/employer"
                                            className="inline-block mt-4 px-4 py-2 bg-woork-teal text-white rounded-xl hover:bg-woork-teal/80"
                                        >
                                            Find Candidates
                                        </Link>
                                    )}
                                    {userType === "teen" && (
                                        <Link
                                            href="/jobs"
                                            className="inline-block mt-4 px-4 py-2 bg-woork-teal text-white rounded-xl hover:bg-woork-teal/80"
                                        >
                                            Browse Jobs
                                        </Link>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Info Box */}
                <div className="mt-6 bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <div className="text-sm text-blue-200">
                            <strong>Safe Messaging:</strong> Messages between employers and teens are monitored for safety.
                            Teens can only message employers they've applied to or who have contacted them about jobs.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
