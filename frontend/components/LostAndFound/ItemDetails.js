import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Header from '../common/Header';
import Footer from '../common/Footer';

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    // Mock current user
    const currentUser = 'Heshani Wickramasinghe';

    useEffect(() => {
        fetchItemDetails();
        fetchMessages();
        // Simple polling for new messages
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [id]);

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

    const fetchMessages = async () => {
        try {
            const res = await fetch(`http://localhost:5000/api/messages/${id}`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !item) return;

        try {
            // Determine receiver based on item owner vs current user
            const receiverName = item.userName === currentUser ? 'Kamal Perera' : item.userName;

            const payload = {
                itemId: id,
                senderName: currentUser,
                receiverName: receiverName,
                text: newMessage
            };

            const res = await fetch('http://localhost:5000/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setNewMessage('');
                fetchMessages();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    if (!item) return <div className="text-center p-10">Loading...</div>;

    // Based on the 5th image, layout has a left column with item image + details, and a right column with chat
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
            <Header user={{ name: currentUser, avatar: 'HW', email: 'it23890988@my.sliit.lk' }} />

            <main className="flex-grow max-w-7xl mx-auto w-full p-6 flex flex-col lg:flex-row gap-8">
                {/* Left Column: Item Details */}
                <div className="w-full lg:w-3/5 space-y-6">
                    {/* Image Area */}
                    <div className="w-full h-80 bg-gray-200 rounded-3xl overflow-hidden shadow-sm relative">
                        {item.photo ? (
                            <img src={item.photo} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400 text-lg font-medium">No Image Available</div>
                        )}
                    </div>

                    {/* Details Card */}
                    <div className="bg-white rounded-3xl p-8 shadow-sm">
                        <h2 className="text-3xl font-black text-gray-800 mb-2">{item.name}</h2>
                        <div className="inline-flex items-center gap-2 mb-6">
                            <span className="text-teal-500 pt-0.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" /><path d="M7 7h.01" /></svg>
                            </span>
                            <span className="text-gray-500 font-medium">{item.category}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                    Location
                                </p>
                                <p className="font-bold text-gray-800">{item.location}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                                    Date & Time
                                </p>
                                <p className="font-bold text-gray-800">
                                    {new Date(item.date || item.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>

                        <div>
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 px-1">Description</p>
                            <p className="text-gray-600 leading-relaxed px-1">
                                {item.description || "No description provided."}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right Column: Chat Box */}
                <div className="w-full lg:w-2/5 flex flex-col">
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col h-[600px] overflow-hidden">
                        {/* Chat Header */}
                        <div className="p-5 border-b border-gray-100 flex justify-between items-center bg-white z-10">
                            <div className="flex items-center gap-3 w-full">
                                <div className="w-12 h-12 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                    {item.userName.substring(0, 2).toUpperCase()}
                                </div>
                                <div className="flex flex-col flex-1 overflow-hidden">
                                    <h3 className="font-bold text-gray-800 truncate">{item.userName}</h3>
                                    <span className="text-xs font-medium text-teal-600 truncate">Re: {item.name}</span>
                                </div>
                                <button className="shrink-0 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-slate-800 transition flex items-center gap-2">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-400"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /></svg>
                                    Handover
                                </button>
                            </div>
                        </div>

                        <div className="text-center py-2 bg-gray-50 border-b border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-center items-center gap-1.5">
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-teal-500"><rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                                End-to-End Encrypted
                            </span>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 p-5 overflow-y-auto bg-gray-50 flex flex-col gap-4">
                            {messages.length === 0 ? (
                                <div className="h-full flex items-center justify-center text-sm font-medium text-gray-400">
                                    No messages yet. Start the conversation!
                                </div>
                            ) : null}
                            {messages.map((msg, index) => {
                                const isMe = msg.senderName === currentUser;
                                return (
                                    <div key={index} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                        <div
                                            className={`max-w-[80%] p-3.5 rounded-2xl shadow-sm text-sm ${isMe
                                                ? 'bg-teal-500 text-white rounded-br-none'
                                                : 'bg-white border border-gray-100 text-gray-800 rounded-bl-none'
                                                }`}
                                        >
                                            {msg.text}
                                        </div>
                                        <span className="text-[10px] font-bold text-gray-400 mt-1.5 px-1 uppercase tracking-wider">
                                            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-white border-t border-gray-100">
                            <form
                                onSubmit={handleSendMessage}
                                className="flex items-center bg-gray-50 border border-gray-200 rounded-full p-1.5 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-transparent transition-all"
                            >
                                <button type="button" className="p-2 text-gray-400 hover:text-gray-600 transition">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" /></svg>
                                </button>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-transparent px-2 py-2 text-sm outline-none text-gray-700 placeholder:text-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!newMessage.trim()}
                                    className="p-2 bg-teal-500 text-white rounded-full hover:bg-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition transform active:scale-95 shadow-sm"
                                >
                                    <span className="w-5 h-5 flex items-center justify-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></svg>
                                    </span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ItemDetails;
