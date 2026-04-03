import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import io from 'socket.io-client';

const socket = io.connect('http://localhost:5000');

const ItemDetails = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [conversations, setConversations] = useState([]); // List of users who messaged the owner
    const [selectedPartner, setSelectedPartner] = useState(null); // Current chat partner
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'chat'
    const messagesEndRef = useRef(null);

    const getStoredUser = () => {
        try {
            const rawUser = sessionStorage.getItem('loggedInUser');
            return rawUser ? JSON.parse(rawUser) : null;
        } catch (_error) {
            return null;
        }
    };

    const currentUser = location.state?.user || getStoredUser();
    const currentUserName = currentUser?.name || 'Guest User';
    const canChat = !!currentUser;

    useEffect(() => {
        fetchItemDetails();
    }, [id]);

    const getRoomId = (itemId, user1, user2) => {
        const users = [user1, user2].sort();
        return `${itemId}-${users[0]}-${users[1]}`;
    };

    useEffect(() => {
        if (!item || !currentUser) return;
        const isOwner = item.userName === currentUserName;
        if (isOwner) {
            fetchConversations();
            setViewMode('list');
        } else {
            setSelectedPartner(item.userName);
            setViewMode('chat');
        }
    }, [item, currentUser, currentUserName]);

    useEffect(() => {
        if (!selectedPartner || !item || !currentUser) return;

        const roomId = getRoomId(id, currentUserName, selectedPartner);
        socket.emit("join_room", roomId);
        fetchMessages(selectedPartner);

        const receiveMessageListener = (data) => {
            const currentRoom = getRoomId(id, currentUserName, selectedPartner);
            const incomingRoom = getRoomId(data.itemId, data.senderName, data.receiverName);
            if (incomingRoom === currentRoom) {
                setMessages((prev) => [...prev, data]);
            }
        };

        socket.on("receive_message", receiveMessageListener);
        return () => socket.off("receive_message", receiveMessageListener);
    }, [id, selectedPartner, item, currentUser, currentUserName]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const fetchItemDetails = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/items/${id}`);
            if (res.ok) {
                const data = await res.json();
                setItem(data);
            }
        } catch (error) {
            console.error('Error fetching item details:', error);
        }
    };

    const fetchConversations = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/messages/${id}/conversations?ownerName=${currentUserName}`);
            if (res.ok) {
                const data = await res.json();
                setConversations(data);
            }
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchMessages = async (partner) => {
        try {
            const res = await fetch(`http://localhost:5000/api/messages/${id}?user1=${currentUserName}&user2=${partner}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        if (e) e.preventDefault();
        if (!currentUser) return;
        const textToSend = typeof e === 'string' ? e : newMessage;
        if (!textToSend.trim() || !item || !selectedPartner) return;

        try {
            const roomId = getRoomId(id, currentUserName, selectedPartner);
            const messageData = {
                itemId: id,
                senderName: currentUserName,
                receiverName: selectedPartner,
                text: textToSend,
                room: roomId
            };

            socket.emit("send_message", messageData);
            if (typeof e !== 'string') setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const selectConversation = (partner) => {
        setSelectedPartner(partner);
        setViewMode('chat');
    };

    if (!item) return <div className="text-center p-10 font-black uppercase text-slate-300">Loading...</div>;

    const isOwner = item.userName === currentUserName;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header user={currentUser} />

            <main className="flex-grow max-w-7xl mx-auto w-full p-6 flex flex-col lg:flex-row gap-8">
                {/* Item Info Column */}
                <div className="w-full lg:w-3/5 space-y-6">
                    <div className="w-full h-96 bg-gray-200 rounded-[40px] overflow-hidden shadow-2xl relative border-8 border-white">
                        {item.photo ? (
                            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-slate-100 italic">No Image Available</div>
                        )}
                        <div className="absolute top-6 left-6">
                            <span className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest text-white shadow-xl ${item.type === 'Lost' ? 'bg-rose-600' : 'bg-emerald-600'}`}>
                                {item.type}
                            </span>
                        </div>
                    </div>

                    <div className="bg-white rounded-[40px] p-10 shadow-xl border border-gray-100">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <h2 className="text-3xl font-black text-slate-900 mb-1 leading-tight uppercase tracking-tight">{item.name}</h2>
                                <span className="px-3 py-1 bg-slate-100 rounded-lg text-[8px] font-black text-slate-400 uppercase tracking-widest leading-none inline-block">{item.category}</span>
                            </div>
                            <div className="text-right">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Posted By</p>
                                <p className="text-xs font-black text-blue-600 uppercase tracking-widest">{item.userName}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Location</p>
                                <p className="text-sm font-black text-slate-800">{item.location}</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2">Date</p>
                                <p className="text-sm font-black text-slate-800">{new Date(item.date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div>
                            <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-3 px-1">Description</p>
                            <div className="text-slate-600 bg-slate-50/50 p-6 rounded-3xl text-sm leading-relaxed border border-dashed border-slate-200">
                                {item.description || "No description provided."}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Chat Column */}
                <div className="w-full lg:w-2/5">
                    {!canChat ? (
                        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 h-[600px] flex flex-col items-center justify-center text-center">
                            <div className="w-16 h-16 rounded-2xl bg-[#023E8A]/10 text-[#023E8A] flex items-center justify-center mb-5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21v-2a4 4 0 0 1 4-4h3" /><circle cx="12" cy="7" r="4" /><path d="M16 11l2 2 4-4" /></svg>
                            </div>
                            <h3 className="text-lg font-black uppercase tracking-tight text-slate-900">Login Required</h3>
                            <p className="mt-3 text-sm font-medium leading-relaxed text-slate-500 max-w-xs">
                                Sign in to start a private chat with the owner or reply to inquiries.
                            </p>
                            <button
                                onClick={() => navigate('/Login', { state: { from: location.pathname } })}
                                className="mt-8 rounded-2xl bg-[#023E8A] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-[#022f6a]"
                            >
                                Go to Login
                            </button>
                        </div>
                    ) : isOwner && viewMode === 'list' ? (
                        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 p-8 h-[600px] flex flex-col">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="h-8 w-1.5 bg-[#023E8A] rounded-full"></div>
                                <h3 className="text-xs font-black uppercase tracking-widest text-slate-800">Direct Inquiries</h3>
                            </div>
                            
                            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-hide">
                                {conversations.length > 0 ? (
                                    conversations.map(partner => (
                                        <div
                                            key={partner}
                                            onClick={() => selectConversation(partner)}
                                            className="group flex items-center gap-4 p-4 rounded-3xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all cursor-pointer"
                                        >
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-lg group-hover:scale-105 transition-transform">
                                                {partner.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-black text-sm uppercase tracking-tight text-slate-800">{partner}</h4>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Tap to view private chat</p>
                                            </div>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-slate-200 group-hover:text-[#023E8A] transition-colors"><path d="m9 18 6-6-6-6"/></svg>
                                        </div>
                                    ))
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                                        <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">No conversations yet</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-[40px] shadow-2xl border border-slate-100 flex flex-col h-[600px] overflow-hidden relative">
                            {/* Chat Header */}
                            <div className="p-8 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50/30 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-[#023E8A] rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner">
                                        {selectedPartner?.charAt(0).toUpperCase() || '?'}
                                    </div>
                                    <div>
                                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Private chat with</p>
                                        <h3 className="font-black text-slate-800 text-base uppercase tracking-tight">{selectedPartner || "Direct Message"}</h3>
                                    </div>
                                </div>
                                {isOwner && (
                                    <button 
                                        onClick={() => setViewMode('list')}
                                        className="px-4 py-2 bg-slate-100 rounded-xl text-[8px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-200 transition-all border border-slate-200"
                                    >
                                        Back to List
                                    </button>
                                )}
                            </div>

                            {/* Messages List Area */}
                            <div className="flex-1 p-8 overflow-y-auto bg-slate-50/30 flex flex-col gap-6 scrollbar-hide">
                                {messages.length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center px-6">
                                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-200"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" /></svg>
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 leading-relaxed max-w-[200px]">Send a private message to start investigating this item.</p>
                                    </div>
                                ) : (
                                    messages.map((msg, index) => {
                                        const isMe = msg.senderName === currentUserName;
                                        return (
                                            <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                                <span className={`text-[8px] font-black text-slate-300 uppercase tracking-tighter mb-1.5 ${isMe ? 'mr-1' : 'ml-1'}`}>{msg.senderName}</span>
                                                <div className={`max-w-[85%] p-4 rounded-3xl text-sm font-medium shadow-sm leading-relaxed ${
                                                    isMe 
                                                    ? 'bg-[#023E8A] text-white rounded-tr-none' 
                                                    : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
                                                }`}>
                                                    {msg.text}
                                                </div>
                                            </div>
                                        );
                                    })
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="p-6 bg-white border-t border-slate-50">
                                <form onSubmit={handleSendMessage} className="flex gap-3 bg-slate-50 border-2 border-slate-100 rounded-[28px] p-2 focus-within:ring-4 focus-within:ring-blue-50 focus-within:border-blue-400 transition-all duration-300">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        placeholder="Type your private message..."
                                        className="flex-1 bg-transparent px-4 py-3 text-sm font-bold outline-none text-slate-700 placeholder:text-slate-400"
                                    />
                                    <button type="submit" disabled={!newMessage.trim()} className="w-12 h-12 bg-[#023E8A] text-white rounded-2xl hover:bg-blue-700 disabled:opacity-20 shadow-lg flex items-center justify-center transition-all active:scale-95">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ItemDetails;

