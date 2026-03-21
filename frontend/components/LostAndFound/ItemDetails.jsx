import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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
            {/* Header placeholder */}
            <header className="bg-slate-900 text-white p-4 flex justify-between items-center px-10">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-teal-600 rounded flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white opacity-80"></div>
                    </div>
                    <div>
                        <h1 className="text-xl font-bold tracking-wide">Lost & Found</h1>
                        <p className="text-xs text-slate-400">IT23890988 – Wickramasinghe B A H | Registration & Recovery</p>
                    </div>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="bg-teal-500 hover:bg-teal-600 px-4 py-2 rounded-md text-sm font-semibold flex items-center gap-2 transition"
                >
                    &larr; Dashboard
                </button>
            </header>

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
                            <span className="text-teal-500 text-xl pt-0.5">🏷️</span>
                            <span className="text-gray-500 font-medium">{item.category}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <span className="text-sm">📍</span> Location
                                </p>
                                <p className="font-bold text-gray-800">{item.location}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <span className="text-sm">📅</span> Date & Time
                                </p>
                                <p className="font-bold text-gray-800">
                                    {new Date(item.date || item.createdAt).toLocaleString()}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <span className="text-sm">🎨</span> Color
                                </p>
                                <p className="font-bold text-gray-800">{item.color || "Not specified"}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <span className="text-sm">📐</span> Brand / Size
                                </p>
                                <p className="font-bold text-gray-800">{item.brandSize || "Not specified"}</p>
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
                                    <span className="text-teal-400 text-lg">🛡️</span> Handover
                                </button>
                            </div>
                        </div>

                        <div className="text-center py-2 bg-gray-50 border-b border-gray-100">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex justify-center items-center gap-1.5">
                                <span className="text-teal-500">🔒</span> End-to-End Encrypted
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
                                    <span className="text-xl">📎</span>
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
                                    <span className="text-lg w-5 h-5 flex items-center justify-center">➤</span>
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ItemDetails;
