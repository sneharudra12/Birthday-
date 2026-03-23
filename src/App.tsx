import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion';
import { 
  Heart, 
  Music, 
  Music2, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Gift, 
  Camera, 
  Star, 
  ChevronDown,
  Sparkles,
  Pencil
} from 'lucide-react';
import confetti from 'canvas-confetti';

// --- Constants ---

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=1000&auto=format&fit=crop";

const STABLE_HERO_PHOTO = "https://i.imgur.com/GQuLMMF.jpeg";

const STABLE_MEMORIES = [
  { id: 1, url: "https://i.imgur.com/RwO0KXi.jpeg", title: "Special Memory" },
  { id: 2, url: "https://i.imgur.com/qgrio4m.jpeg", title: "Beautiful Smile" },
  { id: 3, url: "https://i.imgur.com/GbfC6Nr.jpeg", title: "Joyful Moments" },
  { id: 4, url: "https://i.imgur.com/MQsB9Ld.jpeg", title: "Shining Bright" },
  { id: 5, url: "https://i.imgur.com/bMaFMMf.jpeg", title: "Pure Elegance" },
  { id: 6, url: "https://i.imgur.com/J2Fv5fD.jpeg", title: "Golden Hour" },
  { id: 7, url: "https://i.imgur.com/DtMrKAd.jpeg", title: "Sweet Laughter" },
  { id: 8, url: "https://i.imgur.com/8heBV49.jpeg", title: "Unforgettable Day" },
];

// --- Custom Hooks ---

const useTypingEffect = (text: string, speed: number = 50) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let i = 0;
    const timer = setInterval(() => {
      setDisplayedText(text.slice(0, i + 1));
      i++;
      if (i >= text.length) {
        clearInterval(timer);
        setIsFinished(true);
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return { displayedText, isFinished };
};

// --- Components ---

const FloatingParticles = () => {
  const particles = useMemo(() => Array.from({ length: 20 }), []);
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-pink-300/40 dark:text-pink-500/20"
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: '110%', 
            scale: Math.random() * 0.5 + 0.5,
            rotate: 0 
          }}
          animate={{ 
            y: '-10%', 
            rotate: 360,
            x: (Math.random() * 100) + '%'
          }}
          transition={{ 
            duration: Math.random() * 10 + 10, 
            repeat: Infinity, 
            ease: "linear",
            delay: Math.random() * 10
          }}
        >
          {i % 2 === 0 ? <Heart size={Math.random() * 20 + 10} fill="currentColor" /> : <Sparkles size={Math.random() * 15 + 10} />}
        </motion.div>
      ))}
    </div>
  );
};

const ThemeToggle = ({ isDark, toggle }: { isDark: boolean, toggle: () => void }) => (
  <button 
    onClick={toggle}
    className="fixed top-6 right-6 z-50 p-3 rounded-full glass dark:glass-dark hover:scale-110 transition-transform"
  >
    {isDark ? <Sun className="text-yellow-400" /> : <Moon className="text-slate-700" />}
  </button>
);

const MusicPlayer = ({ isPlaying, togglePlay, playerRef }: { isPlaying: boolean, togglePlay: () => void, playerRef: React.RefObject<HTMLIFrameElement | null> }) => {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
      <AnimatePresence>
        {isPlaying && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass dark:glass-dark px-4 py-2 rounded-full text-xs font-medium"
          >
            Now Playing: Alag Aasman - Anuv Jain
          </motion.div>
        )}
      </AnimatePresence>
      <button 
        onClick={togglePlay}
        className="p-3 rounded-full glass dark:glass-dark hover:scale-110 transition-transform"
      >
        {isPlaying ? <Volume2 className="text-pink-500" /> : <VolumeX className="text-slate-500" />}
      </button>
      {/* YouTube Embed for Alag Aasman - Hidden */}
      <iframe
        ref={playerRef}
        className="hidden"
        src="https://www.youtube.com/embed/vA86QFrXoho?enablejsapi=1&autoplay=0&loop=1&playlist=vA86QFrXoho"
        allow="autoplay"
      />
    </div>
  );
};

const PhotoUploader = ({ onUpload, className }: { onUpload: (url: string) => void, className?: string }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
        alert("Note: This change is temporary and only visible in your current browser session. To make it permanent, you would need to host the image online.");
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={className}>
      <button 
        onClick={() => fileInputRef.current?.click()}
        className="p-2 rounded-full bg-white/80 dark:bg-black/50 backdrop-blur-sm shadow-md hover:scale-110 transition-transform text-pink-500"
        title="Change Photo (Temporary)"
      >
        <Pencil size={16} />
      </button>
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />
    </div>
  );
};

const Hero = ({ photo, onPhotoChange, onPlayMusic }: { photo: string, onPhotoChange: (url: string) => void, onPlayMusic: () => void }) => (
  <section className="min-h-screen flex flex-col items-center justify-center relative px-6 text-center">
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative mb-8"
    >
      <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-pink-400 p-2 shadow-[0_0_30px_rgba(244,114,182,0.5)] floating overflow-hidden">
        <img 
          src={photo} 
          alt="Sneha Ghosh" 
          className="w-full h-full object-cover rounded-full"
          referrerPolicy="no-referrer"
          onError={(e) => {
            (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
          }}
        />
      </div>
      <PhotoUploader 
        onUpload={onPhotoChange} 
        className="absolute bottom-2 right-2 z-20" 
      />
      <motion.div 
        className="absolute -top-4 -right-4 text-pink-500"
        animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <Heart fill="currentColor" size={40} />
      </motion.div>
    </motion.div>

    <motion.h1 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent"
    >
      Happy Birthday Sneha Ghosh 🎂✨
    </motion.h1>

    <motion.p 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mb-8"
    >
      A special day for the most special person in my life 💖
    </motion.p>

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.1 }}
      className="flex flex-col items-center gap-4"
    >
      <button 
        onClick={onPlayMusic}
        className="glass dark:glass-dark px-6 py-3 rounded-full flex items-center gap-2 hover:scale-105 transition-transform text-pink-500 font-medium shadow-md"
      >
        <Music size={20} />
        Play our song 🎶
      </button>
      <a 
        href="https://www.youtube.com/watch?v=vA86QFrXoho" 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-xs text-slate-400 hover:text-pink-400 transition-colors flex items-center gap-1"
      >
        Watch on YouTube <ChevronDown size={12} className="-rotate-90" />
      </a>
    </motion.div>

    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.8, duration: 1 }}
      className="absolute bottom-10"
    >
      <ChevronDown className="animate-bounce text-pink-400" size={32} />
    </motion.div>
  </section>
);

const Message = () => {
  const { displayedText } = useTypingEffect(
    "Sneha, you are not just a friend, you are a part of my life that I can never replace. Your smile makes my days brighter, and your presence makes everything better. Thank you for always being there, supporting me, and understanding me. I am really lucky to have you in my life. 💕",
    40
  );

  return (
    <section className="py-20 px-6 max-w-4xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass dark:glass-dark p-8 md:p-12 rounded-3xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-2 h-full bg-pink-400" />
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Heart className="text-pink-500" fill="currentColor" />
          A Heartfelt Note
        </h2>
        <p className="text-xl md:text-2xl leading-relaxed font-serif italic text-slate-700 dark:text-slate-200 min-h-[200px]">
          {displayedText}
          <span className="typing-cursor" />
        </p>
      </motion.div>
    </section>
  );
};

const Memory = ({ memories, onPhotoChange }: { memories: { id: number, url: string, title: string }[], onPhotoChange: (id: number, url: string) => void }) => {
  return (
    <section className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
          <Camera className="text-pink-500" />
          Beautiful Memories
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {memories.map((mem, idx) => (
            <motion.div
              key={mem.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 2 }}
              className="relative group rounded-2xl overflow-hidden shadow-lg aspect-[3/4]"
            >
              <img 
                src={mem.url} 
                alt={mem.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = FALLBACK_IMAGE;
                }}
              />
              <PhotoUploader 
                onUpload={(url) => onPhotoChange(mem.id, url)} 
                className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-pink-500/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 pointer-events-none">
                <p className="text-white font-medium">{mem.title}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const WhySpecial = () => {
  const points = [
    "I was lost after seeing her eyes, I wonder how she would look at the mirror.",
    "You always support me no matter what",
    "Your smile is my favorite thing",
    "You make every moment fun and unforgettable",
    "You understand me without words"
  ];

  return (
    <section className="py-20 px-6 bg-white/10 dark:bg-black/10 backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-12 text-center flex items-center justify-center gap-3">
          <Star className="text-yellow-500" fill="currentColor" />
          Why You're So Special
        </h2>
        <div className="grid gap-6">
          {points.map((point, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.2 }}
              className="glass dark:glass-dark p-6 rounded-2xl flex items-center gap-4 hover:translate-x-4 transition-transform"
            >
              <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center text-pink-500 shrink-0">
                <Sparkles size={24} />
              </div>
              <p className="text-lg md:text-xl font-medium">{point}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Final = () => {
  const [showSurprise, setShowSurprise] = useState(false);

  const handleSurprise = () => {
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffc0cb', '#ff69b4', '#ffffff', '#e6e6fa']
    });
    setShowSurprise(true);
  };

  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 text-center relative overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="z-10"
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-8 text-pink-600 dark:text-pink-400">
          Once Again, Happy Birthday Sneha 💖
        </h2>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleSurprise}
          className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-10 py-4 rounded-full text-xl font-bold shadow-xl hover:shadow-pink-500/50 transition-shadow flex items-center gap-3 mx-auto"
        >
          <Gift />
          Click for Surprise 🎁
        </motion.button>

        <AnimatePresence>
          {showSurprise && (
            <motion.div
              initial={{ opacity: 0, y: 50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mt-12 glass dark:glass-dark p-8 rounded-3xl max-w-md mx-auto"
            >
              <p className="text-2xl font-bold text-pink-600 dark:text-pink-400 mb-4">
                You mean a lot to me!
              </p>
              <p className="text-slate-600 dark:text-slate-300">
                May your year be as bright and beautiful as your soul. Keep shining, Sneha! ✨
              </p>
              <button 
                onClick={() => setShowSurprise(false)}
                className="mt-6 text-sm text-pink-500 underline"
              >
                Close
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-300/20 dark:bg-pink-500/10 blur-[100px] rounded-full -z-10" />
    </section>
  );
};

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);

  const togglePlay = () => {
    if (playerRef.current) {
      const message = isPlaying ? '{"event":"command","func":"pauseVideo","args":""}' : '{"event":"command","func":"playVideo","args":""}';
      playerRef.current.contentWindow?.postMessage(message, '*');
      setIsPlaying(!isPlaying);
    }
  };

  const startMusic = () => {
    if (!isPlaying && playerRef.current) {
      playerRef.current.contentWindow?.postMessage('{"event":"command","func":"playVideo","args":""}', '*');
      setIsPlaying(true);
    }
  };

  const [heroPhoto, setHeroPhoto] = useState(STABLE_HERO_PHOTO);
  const [memories, setMemories] = useState(STABLE_MEMORIES);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.body.classList.toggle('dark');
  };

  const handleHeroPhotoChange = (url: string) => {
    setHeroPhoto(url);
  };

  const handleMemoryPhotoChange = (id: number, url: string) => {
    setMemories(prev => prev.map(m => m.id === id ? { ...m, url } : m));
  };

  return (
    <div className={`transition-colors duration-500 ${isDark ? 'dark' : ''}`}>
      {/* Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-pink-500 z-[100] origin-left" 
        style={{ scaleX }}
      />

      <FloatingParticles />
      <ThemeToggle isDark={isDark} toggle={toggleTheme} />
      <MusicPlayer isPlaying={isPlaying} togglePlay={togglePlay} playerRef={playerRef} />

      <main className="relative z-10">
        <Hero photo={heroPhoto} onPhotoChange={handleHeroPhotoChange} onPlayMusic={startMusic} />
        <Message />
        <Memory memories={memories} onPhotoChange={handleMemoryPhotoChange} />
        <WhySpecial />
        <Final />
      </main>

      <footer className="py-10 text-center text-slate-500 dark:text-slate-400 text-sm">
        <p>Made with 💖 for Sneha Ghosh</p>
      </footer>
    </div>
  );
}
