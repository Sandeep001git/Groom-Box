'use client'

import { useEffect, useState, useRef } from 'react'
import { socket } from '@/socket.io'
import ControlButtons from '@/components/ControlButtons'
import { Button } from '@/components/ui/button'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { useToast } from '@/components/ui/use-toast'
import { motion } from 'framer-motion'
import { openMediaDevices } from '@/hooks/functions'
import peerConnectionConfig from '@/config/peer.config'
import DOMPurify from 'dompurify'

interface Room {
    name?: string
    adminId?: number
    id?: string
    isPrivate: false
}

export default function Home() {
    const params = useParams()
    const { id } = params
    const router = useRouter()
    const { toast } = useToast()
    const audioElementRef = useRef<HTMLAudioElement | null>(null)
    const videoElementRef = useRef<HTMLVideoElement | null>(null)
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const mediaStreamRef = useRef<MediaStream | null>(null)
    const peerConnectionRef = useRef<RTCPeerConnection | null>(null)
    const remoteStreamRefs = useRef<HTMLVideoElement[]>([])

    const [remoteStreams, setRemoteStreams] = useState<MediaStream[]>([])
    const [room, setRoom] = useState<Room | null>(null)
    const [isMessageEnable, setIsMessageEnable] = useState(false)
    const [isVolumeEnable, setIsVolumeEnable] = useState(false)
    const [isVideoEnable, setIsVideoEnable] = useState(false)
    const [isMicEnable, setIsMicEnable] = useState(false)
    const [isScreenShareEnable, setIsScreenShareEnable] = useState(false)
    const [message, setMessage] = useState('')
    const [showControls, setShowControls] = useState(true)
    const [isInputVisible, setInputVisible] = useState(false)
    const [messages, setMessages] = useState<string[]>([])

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await axios.get(`/api/get-room?id=${id}`)
                const { data } = response.data
                setRoom(data)
                toast({
                    title: 'Joined room',
                    description: 'You have joined the room, now enjoy 😁😁',
                })
            } catch (error) {
                toast({
                    title: 'Failed to join the room',
                    description: 'Refresh and try again',
                })
            }
        }
        fetchData()
    }, [id, toast])

    useEffect(() => {
        async function setupMedia() {
            const videoElement = videoElementRef.current
            const audioElement = audioElementRef.current
            try {
                const constraints = {
                    video: isVideoEnable,
                    audio: isMicEnable,
                }

                if (!constraints.video && !constraints.audio) {
                    if (mediaStreamRef.current) {
                        mediaStreamRef.current
                            .getTracks()
                            .forEach((track) => track.stop())
                        mediaStreamRef.current = null
                    }
                    if (videoElement) {
                        videoElement.srcObject = null
                    }
                    return
                }

                const stream = await openMediaDevices(constraints)
                mediaStreamRef.current = stream
                if (videoElement) {
                    videoElement.srcObject = stream
                }

                if (isVolumeEnable && audioElement) {
                    audioElement.volume = 1 // Set volume to full
                } else if (audioElement) {
                    audioElement.volume = 0 // Mute the audio
                }
            } catch (error: any) {
                console.error('Error accessing media devices:', error.message)
                toast({
                    title: 'Media Access Error',
                    description: `Could not access media devices: ${error.message}`,
                })
            }
        }

        setupMedia()

        return () => {
            if (mediaStreamRef.current) {
                mediaStreamRef.current
                    .getTracks()
                    .forEach((track) => track.stop())
            }
        }
    }, [isVideoEnable, isMicEnable, isVolumeEnable, toast])

    useEffect(() => {
        async function startWebRtcConnection() {
            peerConnectionRef.current = new RTCPeerConnection(
                peerConnectionConfig
            )

            const handleOffer = async (offer: RTCSessionDescriptionInit) => {
                try {
                    if (peerConnectionRef.current) {
                        await peerConnectionRef.current.setRemoteDescription(
                            new RTCSessionDescription(offer)
                        )
                        const answer =
                            await peerConnectionRef.current.createAnswer()
                        await peerConnectionRef.current.setLocalDescription(
                            answer
                        )
                        socket.emit('answer', answer)
                    }
                } catch (error) {
                    console.error('Failed to process offer:', error)
                    toast({
                        title: 'Error',
                        description:
                            'An error occurred while processing the offer.',
                    })
                }
            }

            const handleAnswer = async (answer: RTCSessionDescriptionInit) => {
                try {
                    if (peerConnectionRef.current) {
                        await peerConnectionRef.current.setRemoteDescription(
                            new RTCSessionDescription(answer)
                        )
                    }
                } catch (error) {
                    console.error('Failed to process answer:', error)
                    toast({
                        title: 'Error',
                        description:
                            'An error occurred while processing the answer.',
                    })
                }
            }

            const handleIceCandidate = (candidate: RTCIceCandidateInit) => {
                try {
                    if (peerConnectionRef.current) {
                        peerConnectionRef.current.addIceCandidate(
                            new RTCIceCandidate(candidate)
                        )
                    }
                } catch (error) {
                    console.error('Failed to add ICE candidate:', error)
                    toast({
                        title: 'Error',
                        description:
                            'An error occurred while adding the ICE candidate.',
                    })
                }
            }

            peerConnectionRef.current.onicecandidate = (e) => {
                if (e.candidate) {
                    socket.emit('ice-candidate', e.candidate)
                }
            }

            peerConnectionRef.current.ontrack = (e) => {
                const remoteStream = e.streams[0]
                if (remoteStream) {
                    setRemoteStreams((prevStreams) => {
                        if (
                            !prevStreams.some(
                                (stream) => stream.id === remoteStream.id
                            )
                        ) {
                            return [...prevStreams, remoteStream]
                        }
                        return prevStreams
                    })
                }
            }

            if (mediaStreamRef.current) {
                mediaStreamRef.current.getTracks().forEach((track) => {
                    peerConnectionRef.current?.addTrack(
                        track,
                        mediaStreamRef.current!
                    )
                })
            }

            socket.on('offer', handleOffer)
            socket.on('answer', handleAnswer)
            socket.on('ice-candidate', handleIceCandidate)
        }

        startWebRtcConnection()

        return () => {
            if (peerConnectionRef.current) {
                peerConnectionRef.current.close()
                peerConnectionRef.current = null
            }
            socket.off('offer')
            socket.off('answer')
            socket.off('ice-candidate')
        }
    }, [id, toast])

    useEffect(() => {
        const handleReceiveGroupMessage = (data: { message: string }) => {
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };
    
        socket.on('recive-group-message', (data)=>handleReceiveGroupMessage(data));
    
        return () => {
            socket.off('recive-group-message', handleReceiveGroupMessage);
        };
    }, []);


    const handleSendMessage = () => {
        if (message.trim() !== '') {
            groupMessage(message)
            setMessage('')
            setInputVisible(false)
        }
    }

    const groupMessage = async (data: string) => {
        const sanitizedMessage = DOMPurify.sanitize(data)
        socket.emit('send-group-message', {
            roomName: room?.name,
            message: sanitizedMessage,
        })
        // setMessages((prev) => [...prev, sanitizedMessage])
    }

    const handleMouseMove = () => {
        setShowControls(true)
        if (controlsTimeoutRef.current) {
            clearTimeout(controlsTimeoutRef.current)
        }
        controlsTimeoutRef.current = setTimeout(() => {
            setShowControls(false)
        }, 5000)
    }

    const handleVolumeToggle = () => {
        setIsVolumeEnable((prev) => {
            const newVolumeState = !prev
            if (audioElementRef.current) {
                audioElementRef.current.volume = newVolumeState ? 1 : 0
            }
            return newVolumeState
        })
    }

    const handleEndCall = ()=>{
        // some api call
        router.replace('/dashboard')
    }

    return (
        <div
            className="relative flex flex-col h-screen bg-black text-white overflow-hidden"
            onMouseMove={handleMouseMove}
        >
            <main className="relative flex-1">
                {/* Video Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="relative w-full h-full bg-black"
                >
                    {/* Room Name */}
                    <div className="absolute top-4 left-4 p-2 bg-black bg-opacity-70 rounded-lg text-lg font-semibold">
                        {room?.name || 'Room Name'}
                    </div>

                    {/* Primary Video Feed */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <video
                            ref={videoElementRef}
                            autoPlay
                            playsInline
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* User Name Overlay */}
                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 z-50 flex space-x-4">
                        {/* Control Buttons */}
                        <ControlButtons
                            isVideoEnable={isVideoEnable}
                            isMicEnable={isMicEnable}
                            isVolumeEnable={isVolumeEnable}
                            isMessageEnable={isMessageEnable}
                            isScreenShareEnable={isScreenShareEnable}
                            onToggleVideo={() =>
                                setIsVideoEnable((prev) => !prev)
                            }
                            onToggleMic={() => setIsMicEnable((prev) => !prev)}
                            onToggleVolume={handleVolumeToggle}
                            onToggleMessage={() =>
                                setIsMessageEnable((prev) => !prev)
                            }
                            onToggleScreenShare={() =>
                                setIsScreenShareEnable((prev) => !prev)
                            }
                            onEndCall={() => {
                                handleEndCall
                            }}
                            onSendMessage={() => setInputVisible(true)}
                        />
                    </div>
                </motion.div>

                {/* Additional Remote Video Streams */}
                {remoteStreams.map((stream, index) => (
                    <video
                        key={index}
                        ref={(el) => {
                            if (el) remoteStreamRefs.current[index] = el
                        }}
                        autoPlay
                        playsInline
                        className="absolute bottom-0 right-0 w-1/4 h-1/4 object-cover"
                    />
                ))}
            </main>

            {/* Message Panel */}
            <div
                className={`fixed top-0 right-0 h-full bg-gray-800 p-4 rounded-l-lg border border-gray-600 transition-transform transform ${
                    isMessageEnable || isInputVisible
                        ? 'translate-x-0'
                        : 'translate-x-full'
                } z-50`}
                style={{ width: '300px', height: '100vh' }}
            >
                <div className="flex flex-col h-full">
                    <div className="flex-1 mb-2 overflow-y-auto">
                        {messages.map((msg, index) => (
                            <div key={index} className="text-white mb-1">
                                {msg}
                            </div>
                        ))}
                    </div>
                    <div className="flex-shrink-0">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-2 rounded-lg border border-gray-600 bg-gray-900 text-white mb-2"
                            rows={3} // Adjust the number of rows as needed
                            placeholder="Type a message..."
                            style={{ resize: 'none' }} // Optional: Prevent resizing
                        />
                        {/* Send Button */}
                        <div className="flex justify-end">
                            <Button
                                aria-label="Send Message"
                                onClick={handleSendMessage}
                                className="bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300"
                            >
                                Send
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
