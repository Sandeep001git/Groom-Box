import { FC, useState } from 'react';
import { Button } from '@/components/ui/button';
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
} from 'lucide-react';

interface ControlButtonsProps {
    isVideoEnable: boolean;
    isMicEnable: boolean;
    isVolumeEnable: boolean;
    isMessageEnable: boolean;
    isScreenShareEnable: boolean;
    onToggleVideo: () => void;
    onToggleMic: () => void;
    onToggleVolume: () => void;
    onToggleMessage: () => void;
    onToggleScreenShare: () => void;
    onEndCall: () => void;
    onSendMessage: (message: string) => void;
}

const ControlButtons: FC<ControlButtonsProps> = ({
    isVideoEnable,
    isMicEnable,
    isVolumeEnable,
    isMessageEnable,
    isScreenShareEnable,
    onToggleVideo,
    onToggleMic,
    onToggleVolume,
    onToggleMessage,
    onToggleScreenShare,
    onEndCall,
    onSendMessage,
}) => {
    const [message, setMessage] = useState('');
    const [isInputVisible, setInputVisible] = useState(false);
    const [messages, setMessages] = useState<string[]>([]); // State to store sent messages

    const handleSendMessage = () => {
        if (message.trim()) {
            onSendMessage(message); // Call the parent function
            setMessages((prev) => [...prev, message]); // Store the message locally
            setMessage('');
            setInputVisible(false);
        }
    };

    return (
        <div className="relative">
            {/* Control Buttons */}
            <div className="flex justify-center items-center space-x-4 absolute bottom-4 w-full z-50">
                <Button
                    aria-label="Toggle Microphone"
                    className="bg-gray-700 w-15 h-15 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300"
                    onClick={onToggleMic}
                >
                    {isMicEnable ? (
                        <Mic className="w-8 h-8" />
                    ) : (
                        <MicOff className="w-8 h-8" />
                    )}
                </Button>

                <Button
                    aria-label="Toggle Video"
                    className="bg-gray-700 w-15 h-15 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300"
                    onClick={onToggleVideo}
                >
                    {isVideoEnable ? (
                        <Video className="w-8 h-8" />
                    ) : (
                        <VideoOff className="w-8 h-8" />
                    )}
                </Button>

                <Button
                    aria-label="Toggle Volume"
                    className="bg-gray-700 w-15 h-15 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300"
                    onClick={onToggleVolume}
                >
                    {isVolumeEnable ? (
                        <Volume2Icon className="w-8 h-8" />
                    ) : (
                        <LucideVolumeX className="w-8 h-8" />
                    )}
                </Button>

                <Button
                    aria-label="End Call"
                    className="bg-red-700 w-15 h-15 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300"
                    onClick={onEndCall}
                >
                    <PhoneOff className="w-8 h-8" />
                </Button>

                <Button
                    aria-label="Toggle Messages"
                    className="bg-gray-700 w-15 h-15 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300"
                    onClick={() => {
                        onToggleMessage();
                        setInputVisible((prev) => !prev);
                    }}
                >
                    {isMessageEnable ? (
                        <MessageSquareText className="w-8 h-8" />
                    ) : (
                        <MessageSquareOff className="w-8 h-8" />
                    )}
                </Button>

                <Button
                    aria-label="Toggle Screen Share"
                    className="bg-gray-700 w-15 h-15 rounded-full flex items-center justify-center hover:bg-red-600 transition-all duration-300"
                    onClick={onToggleScreenShare}
                >
                    {isScreenShareEnable ? (
                        <LucideScreenShareOff className="w-8 h-8" />
                    ) : (
                        <LucideScreenShare className="w-8 h-8" />
                    )}
                </Button>
            </div>

        </div>
    );
};

export default ControlButtons;
