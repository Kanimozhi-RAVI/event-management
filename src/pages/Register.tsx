import { useEffect, useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/hooks/use-toast';
import { User, Lock, Mail, Eye, EyeOff, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { resetRegistrationState, signUpRequest } from '@/Redux/Actions/AuthAction';



interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: '',
    email: '',
    password: '',
  });
// eslint-disable-next-line @typescript-eslint/no-unused-vars

  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch =useDispatch()



    useEffect(() => {
    // Reset registration state when component mounts
    dispatch(resetRegistrationState());
    
    // Cleanup on unmount
    return () => {
      dispatch(resetRegistrationState());
    };
  }, [dispatch]);
  const validateName = (value: string) => {
    if (!value) return 'Name is required';
    if (value.length < 2) return 'Name must be at least 2 characters';
    return '';
  };

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
  const { loading, error, isRegistered } = useSelector(
    (state: RootState) => state.auth
  );


const handleRegister = () => {
    const nameError = validateName(formData.name);
    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);

    setErrors({ name: nameError, email: emailError, password: passwordError });
    setTouched({ name: true, email: true, password: true });

    if (nameError || emailError || passwordError) {
      toast({
        title: "Validation Error",
        description: "Please fix the errors",
        variant: "destructive",
      });
      return;
    }

    // ✅ Dispatch pannunga (await vendam)
    dispatch(
      signUpRequest(
        formData.email,
        formData.password,
        formData.name
      )
    );
  };

 useEffect(() => {
    if (isRegistered && !loading) {
      toast({
        title: "Account Created Successfully!",
        description: "Redirecting to login page...",
      });

      const timer = setTimeout(() => {
        navigate("/login");
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [isRegistered, loading, navigate, toast]);

  // ✅ Error handling
  useEffect(() => {
    if (error && !loading) {
      toast({
        title: "Registration Failed",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, loading, toast]);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleRegister();
    }
  };

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

  const rightPanelVariants :Variants= {
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
    y: [0, -20, 0], // ✅ animating y
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};
  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster />
      
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 right-0 w-86 h-86 bg-[#1FA8B8]/10 rounded-full blur-3xl"
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
        <Card className="shadow-2xl border-0 overflow-hidden bg-white">
          <div className="grid md:grid-cols-2 min-h-[420px]">
            {/* Left Panel - Image & Branding */}
            <motion.div
              variants={leftPanelVariants}
              initial="hidden"
              animate="visible"
              className="bg-[#65C9DA] from-[#1FA8B8] via-[#1FA8B8] to-[#158894] p-6 flex flex-col items-center justify-center text-white relative overflow-hidden"
            >
              {/* Decorative circles */}
              <motion.div
                className="absolute top-6 right-10 w-32 h-32 border-4 border-white/20 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute bottom-8 left-10 w-24 h-24 border-4 border-white/20 rounded-full"
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
                  className="w-20 h-20 bg-white/20 backdrop-blur-lg rounded-2xl mx-auto flex items-center justify-center shadow-2xl border border-white/30"
                >
                  <UserPlus className="w-10 h-10 text-white" />
                </motion.div>

                <motion.h1
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-5xl font-bold text-center"
                >
                  Join Us Today
                </motion.h1>
                
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xl text-white/90 text-center"
                >
                  Start managing events effortlessly
                </motion.p>

                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <svg className="w-45 h-40 mx-auto" viewBox="0 0 200 200" fill="none">
                    <motion.rect
                      x="60"
                      y="50"
                      width="80"
                      height="100"
                      rx="10"
                      stroke="white"
                      strokeWidth="3"
                      fill="white"
                      fillOpacity="0.1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2, delay: 0.8 }}
                    />
                    <motion.circle
                      cx="100"
                      cy="85"
                      r="15"
                      stroke="white"
                      strokeWidth="3"
                      fill="white"
                      fillOpacity="0.2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1.2 }}
                    />
                    <motion.line
                      x1="75"
                      y1="115"
                      x2="125"
                      y2="115"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 1.4 }}
                    />
                    <motion.line
                      x1="75"
                      y1="130"
                      x2="125"
                      y2="130"
                      stroke="white"
                      strokeWidth="3"
                      strokeLinecap="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, delay: 1.6 }}
                    />
                  </svg>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Right Panel - Register Form */}
            <motion.div
              variants={rightPanelVariants}
              initial="hidden"
              animate="visible"
              className="p-6 flex flex-col justify-center overflow-y-auto"
            >
             <div className="flex flex-col items-center justify-center text-center mb-6">
  {/* Icon */}
  <div className="w-20 h-20 rounded-2xl bg-[#1FA8B8]/10 flex items-center justify-center ">
    <UserPlus className="w-10 h-10 text-[#1FA8B8]" />
  </div>

  {/* Title */}
  <h2 className="text-3xl font-bold text-gray-800">
    Create Your Account
  </h2>
</div>


              {/* Tab Selector */}
             

              <AnimatePresence mode="wait">
                <motion.div
                  // key={activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
                      <User className="w-4 h-4 text-[#1FA8B8]" />
                      Full Name
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData({ ...formData, name: e.target.value });
                        if (touched.name) {
                          setErrors({ ...errors, name: validateName(e.target.value) });
                        }
                      }}
                      onBlur={() => {
                        setTouched({ ...touched, name: true });
                        setErrors({ ...errors, name: validateName(formData.name) });
                      }}
                      onKeyPress={handleKeyPress}
                      placeholder="Enter your full name"
                      className={`h-10 border-2 transition-all ${
                        touched.name && errors.name
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-gray-200 focus:border-[#1FA8B8]'
                      }`}
                    />
                    {touched.name && errors.name && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-red-500 text-sm"
                      >
                        {errors.name}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
                      <Mail className="w-4 h-4 text-[#1FA8B8]" />
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (touched.email) {
                          setErrors({ ...errors, email: validateEmail(e.target.value) });
                        }
                      }}
                      onBlur={() => {
                        setTouched({ ...touched, email: true });
                        setErrors({ ...errors, email: validateEmail(formData.email) });
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
                        className="text-red-500 text-sm"
                      >
                        {errors.email}
                      </motion.p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 font-medium flex items-center gap-2">
                      <Lock className="w-4 h-4 text-[#1FA8B8]" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        value={formData.password}
                        onChange={(e) => {
                          setFormData({ ...formData, password: e.target.value });
                          if (touched.password) {
                            setErrors({ ...errors, password: validatePassword(e.target.value) });
                          }
                        }}
                        onBlur={() => {
                          setTouched({ ...touched, password: true });
                          setErrors({ ...errors, password: validatePassword(formData.password) });
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Create a password"
                        className={`h-10 border-2 transition-all pr-12 ${
                          touched.password && errors.password
                            ? 'border-red-500 focus:border-red-500'
                            : 'border-gray-200 focus:border-[#1FA8B8]'
                        }`}
                      />
                     <motion.button
  type="button"
  onMouseDown={(e) => e.preventDefault()}   // 🔥 IMPORTANT
  onClick={() => setShowPassword(!showPassword)}
  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#1FA8B8] transition-colors"

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
                      onClick={handleRegister}
                      className="w-full h-10 bg-[#1FA8B8] hover:bg-[#158894] text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all"
                      disabled={loading}
                    >
                      {loading ? (
                        <motion.div className="flex items-center gap-3">
                          <motion.div
                            className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full"
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: 'linear'
                            }}
                          />
                          <span>Creating Account...</span>
                        </motion.div>
                      ) : (
                        `Sign Up`
                      )}
                    </Button>
                  </motion.div>

                  <div className="text-center">
                    <p className="text-gray-600">
                      Already have an account?{' '}
                      <button 
                        className="text-[#1FA8B8] hover:text-[#158894] font-semibold" 
                        onClick={() => navigate('/login')}
                      >
                        Sign In
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

export default RegisterPage;