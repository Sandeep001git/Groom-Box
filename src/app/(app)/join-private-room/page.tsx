import JoinRoom from '@/components/JoinRoom'
import { Users, Lock, Zap } from 'lucide-react'

export default function JoinRoomPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="absolute top-1/3 -right-32 h-80 w-80 rounded-full bg-pink-500/20 blur-3xl" />
      </div>

      <section className="relative mx-auto max-w-6xl px-6 py-20">
        {/* Hero */}
        <div className="grid gap-14 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-4 py-1 text-sm text-indigo-400">
              Join an existing room
            </span>

            <h1 className="text-4xl font-extrabold leading-tight md:text-5xl">
              Connect instantly in a
              <span className="block bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                real-time room
              </span>
            </h1>

            <p className="max-w-xl text-slate-400">
              Enter a room ID to join a public or private room. Collaborate
              with your team, friends, or community in real-time.
            </p>

            {/* CTA */}
            <div className="pt-4">
              <JoinRoom />
            </div>
          </div>

          {/* Feature cards */}
          <div className="grid gap-6 sm:grid-cols-2">
            <FeatureCard
              icon={<Users size={22} />}
              title="Team rooms"
              description="Collaborate in a shared space with multiple users."
            />
            <FeatureCard
              icon={<Lock size={22} />}
              title="Private rooms"
              description="Only joinable by invite or approved access."
            />
            <FeatureCard
              icon={<Zap size={22} />}
              title="Instant connection"
              description="Enter a room ID and join in seconds."
              className="sm:col-span-2"
            />
          </div>
        </div>

        <div className="mt-24 border-t border-slate-800 pt-12">
          <div className="grid gap-8 md:grid-cols-3">
            <InfoBlock
              title="Fast access"
              text="No setup required. Just enter the room ID and go live."
            />
            <InfoBlock
              title="Secure sessions"
              text="Session-based authentication ensures safe access."
            />
            <InfoBlock
              title="Scalable"
              text="Works for small groups or large collaborative teams."
            />
          </div>
        </div>
      </section>
    </main>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  className = '',
}: {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}) {
  return (
    <div
      className={`
        rounded-2xl border border-slate-800 bg-slate-900/60 p-6
        transition-all hover:-translate-y-1 hover:border-indigo-500/50
        ${className}
      `}
    >
      <div className="mb-4 inline-flex rounded-lg bg-indigo-500/10 p-3 text-indigo-400">
        {icon}
      </div>
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-slate-400">{description}</p>
    </div>
  )
}

function InfoBlock({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl bg-slate-900/40 p-6">
      <h4 className="font-semibold">{title}</h4>
      <p className="mt-2 text-sm text-slate-400">{text}</p>
    </div>
  )
}
