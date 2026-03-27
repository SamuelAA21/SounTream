import { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, ArrowLeft } from 'lucide-react';
import MusicController from '../../controllers/MusicController';

interface TwoFactorAuthProps {
  onSuccess: () => void;
  onBack: () => void;
}

export function TwoFactorAuth({ onSuccess, onBack }: TwoFactorAuthProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const controller = MusicController.getInstance();

  useEffect(() => {
    // Focus en el primer input
    inputRefs.current[0]?.focus();
    // Mostrar el código en consola para facilitar testing
    console.log('🔐 Código 2FA: 123456');
  }, []);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return; // Solo números

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus en el siguiente input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit cuando todos los campos están llenos
    if (newCode.every((digit) => digit) && index === 5) {
      handleVerify(newCode.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newCode = pastedData.split('').concat(Array(6 - pastedData.length).fill(''));
    setCode(newCode);

    if (pastedData.length === 6) {
      handleVerify(pastedData);
    }
  };

  const handleVerify = (codeToVerify: string) => {
    setError('');
    const result = controller.verifyTwoFactorCode(codeToVerify);
    
    if (result.success) {
      onSuccess();
    } else {
      setError(result.message);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Fondo animado */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-cyan-900">
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        <motion.div
          className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      {/* Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >
        <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 shadow-2xl border border-white/20">
          {/* Back button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver</span>
          </button>

          {/* Icon */}
          <motion.div
            className="flex justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            <div className="bg-gradient-to-br from-purple-500 to-cyan-500 p-4 rounded-2xl">
              <Shield className="w-12 h-12 text-white" />
            </div>
          </motion.div>

          <h2 className="text-2xl text-center mb-2">Autenticación de dos factores</h2>
          <p className="text-gray-400 text-center mb-8">
            Ingresa el código de 6 dígitos que enviamos a tu correo
          </p>

          {/* Code display (demo purposes) */}
          <div className="mb-6 p-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-2xl">
            <p className="text-sm text-gray-300 text-center">
              🔒 Código de demostración: <span className="font-mono text-lg text-white">123456</span>
            </p>
          </div>

          {/* Code inputs */}
          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {code.map((digit, index) => (
              <motion.input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-14 text-center text-2xl bg-white/5 border-2 border-white/10 rounded-xl text-white focus:outline-none focus:border-purple-500 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              />
            ))}
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-4"
            >
              {error}
            </motion.div>
          )}

          <motion.button
            onClick={() => handleVerify(code.join(''))}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-3 rounded-2xl font-medium shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 transition-shadow"
          >
            Verificar Código
          </motion.button>

          <button className="w-full mt-4 text-gray-400 hover:text-white transition-colors text-sm">
            ¿No recibiste el código? Reenviar
          </button>
        </div>
      </motion.div>
    </div>
  );
}