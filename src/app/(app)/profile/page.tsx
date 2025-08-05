'use client'

import { useEffect, useState } from 'react'
import { socket } from '../../../socket.io'
import {
    Video,
    VideoOff,
    MicOff,
    Mic,
    LucideVolumeX,
    Volume2Icon,
    MessageSquareText,
    MessageSquareOff,
    PhoneOff,
    LucideScreenShare,
    LucideScreenShareOff,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'

export default function Home() {
    const router = useRouter()
    const toast = useToast()
    const params = useParams()

    const [isConnected, setIsConnected] = useState(false)
    const [room, setRoom] = useState({})
    const [transport, setTransport] = useState('N/A')
    const [isMessageEnable, setIsMessageEnable] = useState(false)
    const [isVolumeEnable, setIsVolumeEnable] = useState(false)
    const [isVideoEnable, setIsVideoEnable] = useState(false)
    const [isMicEnable, setIsMicEnable] = useState(false)
    const [isScreenShareEnable, setIsScreenShareEnable] = useState(false)
    const [messages, setMessages] = useState([])

    const { id } = params
    useEffect(() => {
        try {
            
        } catch (error) {}
    })

    const groupMessage = async (data: string) => {
        socket.emit('group-message', data)
    }
    const onAllowMessages = () => {
        console.log('trigger')
        setIsMessageEnable(!isMessageEnable)
    }
    return (
        <div className="flex flex-col h-screen bg-background text-white">
            <header className="flex justify-between items-center p-4 bg-gray-800">
                <div className="text-lg font-semibold">Room Name</div>
            </header>

            {/* Main Content */}
            <main className="flex flex-1">
                {/* Video Section */}
                <div className="flex flex-1 flex-wrap justify-center items-center p-4 gap-4">
                    <div className="relative w-full lg:w-3/4 h-96 bg-gray-700 rounded-lg">
                        {/* Primary Video Feed */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-black w-full h-full rounded-lg"></div>
                        </div>
                        <div className="absolute bottom-2 left-2 p-2 bg-black bg-opacity-50 rounded-lg">
                            <span>User Name</span>
                        </div>
                        <div className="flex justify-center items-center bg-opacity-50 space-x-4 p-2 absolute bottom-2 left-2 w-full">
                            <button className="bg-gray-700 p-2 rounded-full hover:bg-red-600">
                                {isMicEnable ? <Mic /> : <MicOff />}
                            </button>
                            <button className="bg-gray-700 p-2 rounded-full hover:bg-red-600">
                                {isVideoEnable ? <Video /> : <VideoOff />}
                            </button>
                            <button className="bg-red-600 p-2 rounded-full hover:bg-red-800">
                                <PhoneOff />
                            </button>
                            <Button
                                onClick={onAllowMessages}
                                className="bg-gray-700 p-2 rounded-full hover:bg-gray-600"
                            >
                                {isMessageEnable ? (
                                    <MessageSquareText />
                                ) : (
                                    <MessageSquareOff />
                                )}
                            </Button>
                            <button className="bg-gray-700 p-2 rounded-full hover:bg-gray-600">
                                {isVolumeEnable ? (
                                    <Volume2Icon />
                                ) : (
                                    <LucideVolumeX />
                                )}
                            </button>
                            <button className="bg-gray-700 p-2 rounded-full hover:bg-gray-600">
                                {isScreenShareEnable ? (
                                    <LucideScreenShare />
                                ) : (
                                    <LucideScreenShareOff />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="flex w-full lg:w-3/4  gap-2">
                        {Array(4)
                            .fill('')
                            .map((_, index) => (
                                <div
                                    key={index}
                                    className="w-full h-24 bg-gray-700 rounded-lg"
                                ></div>
                            ))}
                    </div>
                </div>

                {/* Chat Section */}
                {isMessageEnable ? (
                    <aside className="hidden lg:flex flex-col w-64 bg-gray-800 p-4">
                        <div className="flex-1 overflow-y-auto">
                            {/* Chat Messages */}
                            <div className="space-y-2">
                                <div className="p-2 bg-gray-700 rounded-lg">
                                    <span>User 1: Hello!</span>
                                </div>
                                <div className="p-2 bg-gray-700 rounded-lg">
                                    <span>User 2: Hi there!</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Type a message"
                                className="w-full p-2 bg-gray-700 rounded-lg"
                            />
                        </div>
                    </aside>
                ) : (
                    ''
                )}
            </main>

            {/* Footer */}
            {/* <footer className="p-4 bg-gray-800">
                <div className="flex justify-between items-center">
                    <div className="flex space-x-4">
                        
                    </div>
                    <div>
                        <span className="text-gray-400">
                            © 2024 Your Company
                        </span>
                    </div>
                </div>
            </footer> */}
        </div>
    )
}
