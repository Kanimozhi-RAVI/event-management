import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail, Calendar, Eye, EyeOff, UserCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/store';
import { signInRequest } from '@/Redux/Actions/AuthAction';



const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const { toast } = useToast();
  const navigate = useNavigate();


  const validateEmail = (value: string) => {
    if (!value) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
    return '';
  };

  const validatePassword = (value: string) => {
    if (!value) return 'Password is required';
    if (value.length < 6) return 'Password must be at least 6 characters';
    return '';
  };
const dispatch = useDispatch<AppDispatch>();
const { loading, error, user } = useSelector((state: RootState) => state.auth);

 const handleLogin = () => {
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  setErrors({ email: emailError, password: passwordError });
  setTouched({ email: true, password: true });

  if (emailError || passwordError) {
    toast({
      title: "Validation Error",
      description: "Please fix the errors before submitting",
      variant: "destructive"
    });
    return;
  }

  dispatch(signInRequest(email, password));
    // 🔥 THIS IS THE KEY PART
 }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };
    useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

useEffect(() => {
  if (error) {
    toast({
      title: "Booking Error",
      description: error,
      variant: "destructive", // red/error variant
    });
  }
}, [error, toast]);


  const leftPanelVariants :Variants= {
    hidden: { x: -100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.8
      }
    }
  };

  const rightPanelVariants:Variants= {
    hidden: { x: 100, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 20,
        duration: 0.8,
        delay: 0.2
      }
    }
  };

const floatingAnimation: Variants = {
  float: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
}as const

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster />
      
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 right-0 w-96 h-96 bg-[#1FA8B8]/10 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
      <motion.div
        className="absolute bottom-0 left-0 w-80 h-80 bg-[#1FA8B8]/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, -30, 0],
          y: [0, -40, 0],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 1
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl relative z-10"
      >
        <Card className="shadow-xl border-0 overflow-hidden bg-white rounded-2xl">
          <div className="grid md:grid-cols-2 min-h-[480px]">
            {/* Left Panel - Image & Branding */}
            <motion.div
              variants={leftPanelVariants}
              initial="hidden"
              animate="visible"
              className="px-8 py-6 flex flex-col items-center justify-center text-white relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, #3DA0C1, #65C9DA, #8AD4ED)",
                backgroundSize: "400% 400%"
              }}
            >
              {/* Decorative circles */}
              <motion.div
                className="absolute top-10 right-10 w-32 h-32 border-4 border-white/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute bottom-10 left-10 w-24 h-24 border-4 border-white/20 rounded-full"
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              />

              <motion.div variants={floatingAnimation} className="relative z-10">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.3
                  }}
                  className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-3xl mx-auto mb-8 flex items-center justify-center shadow-2xl border border-white/30"
                >
                  <Calendar className="w-12 h-12 text-white" />
                </motion.div>

                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-bold mb-4 text-center"
                >
                  Event Manager
                </motion.h1>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl text-white/90 text-center mb-8"
                >
                  Organize, Manage & Celebrate
                </motion.p>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                  className="mt-12"
                >
                  <svg className="w-44 h-44 mx-auto" viewBox="0 0 200 200" fill="none">
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="80"
                      stroke="white"
                      strokeWidth="2"
                      fill="white"
                      fillOpacity="0.1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.8 }}
                    />
                    <motion.path
                      d="M100 40 L100 100 L140 120"
                      stroke="white"
                      strokeWidth="4"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 1.2 }}
                    />
                    <motion.circle
                      cx="100"
                      cy="100"
                      r="8"
                      fill="white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.5 }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Panel - Login Form */}
            <motion.div
              variants={rightPanelVariants}
              initial="hidden"
              animate="visible"
              className="px-8 py-4 flex flex-col justify-center"
            >
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="mb-4"
              >
                <div className="flex flex-col items-center justify-center text-center mb-2">
  <div className="w-20 h-20 rounded-2xl bg-[#1FA8B8]/10 flex items-center justify-center ">
    <UserCircle className="w-10 h-10 text-[#1FA8B8]" />
  </div>

  <h2 className="text-3xl font-bold text-gray-800">
    Welcome Back!
  </h2>
</div>


               
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  // key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#1FA8B8]" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (touched.email) {
                          setErrors({ ...errors, email: validateEmail(e.target.value) });
                        }
                      }}
                      onBlur={() => {
                        setTouched({ ...touched, email: true });
                        setErrors({ ...errors, email: validateEmail(email) });
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder={`Enter your email`}
                      className={`h-10 border-2 transition-all ${
                        touched.email && errors.email
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#1FA8B8]'
                      }`}
                    />
                    {touched.email && errors.email && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm flex items-center gap-1"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-gray-700 font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#1FA8B8]" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (touched.password) {
                            setErrors({ ...errors, password: validatePassword(e.target.value) });
                          }
                        }}
                        onBlur={() => {
                          setTouched({ ...touched, password: true });
                          setErrors({ ...errors, password: validatePassword(password) });
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter your password"
                        className={`h-10 border-2 pr-12 transition-all ${
                          touched.password && errors.password
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-200 focus:border-[#1FA8B8]'
                        }`}
                      />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 inset-y-0 flex items-center text-gray-500 hover:text-[#1FA8B8] transition-colors"
                     
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </motion.button>
                    </div>
                    {touched.password && errors.password && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm"
                      >
                        {errors.password}
                      </motion.p>
                    )}
                  </div>

                  <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                    <Button
                      onClick={handleLogin}
                      disabled={loading}
                      className="w-full h-10 bg-[#1FA8B8] hover:bg-[#158894] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
                    >
                      {loading ? (
                        <motion.div className="flex items-center justify-center gap-2">
                          <motion.div
                            className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear'
                            }}
                          />
                          <span>Signing In...</span>
                        </motion.div>
                      ) : (
                        `Sign In`
                      )}
                    </Button>
                  </motion.div>

                  <div className="text-center">
                    <p className="text-gray-600">
                      Don't have an account?{' '}
                      <button 
                        className="text-[#1FA8B8] hover:text-[#158894] font-semibold" 
                        onClick={() => navigate('/signup')}
                      >
                        Sign Up
                      </button>
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default Login;