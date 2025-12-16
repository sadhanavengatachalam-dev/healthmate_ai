
import React, { useState, useEffect, useRef } from 'react';
import { AppView, PatientData, AIResponse, AnimationScene, MedicationLog, MedStatus, Medication } from './types';
import { generatePatientPlan, generateTTSAudio } from './services/geminiService';
import { ToyAvatar } from './components/ToyAvatar';
import { 
  Heart, 
  Activity, 
  CheckCircle, 
  XCircle, 
  Utensils, 
  Play, 
  Pause, 
  ChevronRight,
  ChevronLeft,
  Stethoscope,
  User,
  MapPin,
  AlertTriangle,
  Loader2,
  Upload,
  Image as ImageIcon,
  Trash2,
  Pill,
  Footprints,
  Clock,
  FileText,
  Volume2,
  Film,
  BookOpen,
  Sparkles,
  Phone,
  Globe,
  Users,
  Bell,
  BellRing,
  RotateCcw,
  MessageCircle,
  ShieldAlert,
  Info,
  AlarmClock,
  Sun,
  Siren,
  Thermometer,
  Download,
  FileBarChart,
  Printer,
  Smile,
  Mail,
  CalendarCheck
} from 'lucide-react';

// --- Constants ---
const INDIAN_LOCATIONS = [
  // --- States & Union Territories ---
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", 
  "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", 
  "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", 
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", 
  "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", 
  "Delhi", "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry",

  // --- TAMIL NADU (All Districts) ---
  "Ariyalur, Tamil Nadu", "Chengalpattu, Tamil Nadu", "Chennai, Tamil Nadu", "Coimbatore, Tamil Nadu", 
  "Cuddalore, Tamil Nadu", "Dharmapuri, Tamil Nadu", "Dindigul, Tamil Nadu", "Erode, Tamil Nadu", 
  "Kallakurichi, Tamil Nadu", "Kancheepuram, Tamil Nadu", "Karur, Tamil Nadu", "Krishnagiri, Tamil Nadu", 
  "Madurai, Tamil Nadu", "Mayiladuthurai, Tamil Nadu", "Nagapattinam, Tamil Nadu", "Namakkal, Tamil Nadu", 
  "Nilgiris, Tamil Nadu", "Perambalur, Tamil Nadu", "Pudukkottai, Tamil Nadu", "Ramanathapuram, Tamil Nadu", 
  "Ranipet, Tamil Nadu", "Salem, Tamil Nadu", "Sivaganga, Tamil Nadu", "Tenkasi, Tamil Nadu", 
  "Thanjavur, Tamil Nadu", "Theni, Tamil Nadu", "Thoothukudi, Tamil Nadu", "Tiruchirappalli, Tamil Nadu", 
  "Tirunelveli, Tamil Nadu", "Tirupathur, Tamil Nadu", "Tiruppur, Tamil Nadu", "Tiruvallur, Tamil Nadu", 
  "Tiruvannamalai, Tamil Nadu", "Tiruvarur, Tamil Nadu", "Vellore, Tamil Nadu", "Viluppuram, Tamil Nadu", 
  "Virudhunagar, Tamil Nadu",

  // --- KERALA (All Districts) ---
  "Alappuzha, Kerala", "Ernakulam, Kerala", "Idukki, Kerala", "Kannur, Kerala", "Kasaragod, Kerala", 
  "Kollam, Kerala", "Kottayam, Kerala", "Kozhikode, Kerala", "Malappuram, Kerala", "Palakkad, Kerala", 
  "Pathanamthitta, Kerala", "Thiruvananthapuram, Kerala", "Thrissur, Kerala", "Wayanad, Kerala",

  // --- KARNATAKA (Major Districts) ---
  "Bangalore Urban, Karnataka", "Bangalore Rural, Karnataka", "Belagavi, Karnataka", "Bellary, Karnataka", 
  "Bidar, Karnataka", "Chamarajanagar, Karnataka", "Chikkamagaluru, Karnataka", "Chitradurga, Karnataka", 
  "Dakshina Kannada, Karnataka", "Davanagere, Karnataka", "Dharwad, Karnataka", "Gulbarga, Karnataka", 
  "Hassan, Karnataka", "Haveri, Karnataka", "Kodagu, Karnataka", "Kolar, Karnataka", "Mandya, Karnataka", 
  "Mysore, Karnataka", "Raichur, Karnataka", "Shivamogga, Karnataka", "Tumkur, Karnataka", "Udupi, Karnataka",

  // --- MAHARASHTRA (Major Districts) ---
  "Ahmednagar, Maharashtra", "Akola, Maharashtra", "Amravati, Maharashtra", "Aurangabad, Maharashtra", 
  "Beed, Maharashtra", "Bhandara, Maharashtra", "Buldhana, Maharashtra", "Chandrapur, Maharashtra", 
  "Dhule, Maharashtra", "Gadchiroli, Maharashtra", "Gondia, Maharashtra", "Jalgaon, Maharashtra", 
  "Kolhapur, Maharashtra", "Latur, Maharashtra", "Mumbai City, Maharashtra", "Mumbai Suburban, Maharashtra", 
  "Nagpur, Maharashtra", "Nanded, Maharashtra", "Nashik, Maharashtra", "Palghar, Maharashtra", 
  "Parbhani, Maharashtra", "Pune, Maharashtra", "Raigad, Maharashtra", "Ratnagiri, Maharashtra", 
  "Sangli, Maharashtra", "Satara, Maharashtra", "Sindhudurg, Maharashtra", "Solapur, Maharashtra", 
  "Thane, Maharashtra", "Wardha, Maharashtra",

  // --- ANDHRA PRADESH & TELANGANA (Major Districts) ---
  "Anantapur, Andhra Pradesh", "Chittoor, Andhra Pradesh", "East Godavari, Andhra Pradesh", "Guntur, Andhra Pradesh", 
  "Krishna, Andhra Pradesh", "Kurnool, Andhra Pradesh", "Nellore, Andhra Pradesh", "Prakasam, Andhra Pradesh", 
  "Srikakulam, Andhra Pradesh", "Visakhapatnam, Andhra Pradesh", "Vizianagaram, Andhra Pradesh", 
  "West Godavari, Andhra Pradesh", "Kadapa, Andhra Pradesh",
  "Adilabad, Telangana", "Hyderabad, Telangana", "Karimnagar, Telangana", "Khammam, Telangana", 
  "Mahbubnagar, Telangana", "Nalgonda, Telangana", "Nizamabad, Telangana", 
  "Ranga Reddy, Telangana", "Warangal, Telangana",

  // --- NORTH INDIA (Major Cities/Districts) ---
  "New Delhi, Delhi", "North Delhi, Delhi", "South Delhi, Delhi",
  "Agra, Uttar Pradesh", "Aligarh, Uttar Pradesh", "Allahabad, Uttar Pradesh", "Ayodhya, Uttar Pradesh", 
  "Bareilly, Uttar Pradesh", "Ghaziabad, Uttar Pradesh", "Gorakhpur, Uttar Pradesh", "Jhansi, Uttar Pradesh", 
  "Kanpur, Uttar Pradesh", "Lucknow, Uttar Pradesh", "Meerut, Uttar Pradesh", "Moradabad, Uttar Pradesh", 
  "Noida, Uttar Pradesh", "Varanasi, Uttar Pradesh",
  "Amritsar, Punjab", "Bathinda, Punjab", "Jalandhar, Punjab", "Ludhiana, Punjab", "Patiala, Punjab",
  "Gurgaon, Haryana", "Faridabad, Haryana", "Panipat, Haryana", "Ambala, Haryana",
  "Jaipur, Rajasthan", "Jodhpur, Rajasthan", "Kota, Rajasthan", "Udaipur, Rajasthan", "Ajmer, Rajasthan", 
  "Bikaner, Rajasthan",
  "Dehradun, Uttarakhand", "Haridwar, Uttarakhand", "Nainital, Uttarakhand",
  "Shimla, Himachal Pradesh", "Manali, Himachal Pradesh", "Dharamshala, Himachal Pradesh",
  "Jammu, Jammu and Kashmir", "Srinagar, Jammu and Kashmir", "Leh, Ladakh",

  // --- EAST & CENTRAL INDIA ---
  "Kolkata, West Bengal", "Howrah, West Bengal", "Darjeeling, West Bengal", "Siliguri, West Bengal",
  "Bhubaneswar, Odisha", "Cuttack, Odisha", "Puri, Odisha", "Rourkela, Odisha",
  "Patna, Bihar", "Gaya, Bihar", "Muzaffarpur, Bihar",
  "Ranchi, Jharkhand", "Jamshedpur, Jharkhand", "Dhanbad, Jharkhand",
  "Bhopal, Madhya Pradesh", "Indore, Madhya Pradesh", "Gwalior, Madhya Pradesh", "Jabalpur, Madhya Pradesh", 
  "Ujjain, Madhya Pradesh",
  "Raipur, Chhattisgarh", "Bilaspur, Chhattisgarh", "Bhilai, Chhattisgarh",
  "Guwahati, Assam", "Dibrugarh, Assam", "Silchar, Assam",
  "Shillong, Meghalaya", "Imphal, Manipur", "Aizawl, Mizoram", "Kohima, Nagaland", "Gangtok, Sikkim", 
  "Agartala, Tripura"
];

const LANGUAGES_LIST = [
  "English",
  "Hindi (हिंदी)",
  "Tamil (தமிழ்)",
  "Telugu (తెలుగు)",
  "Malayalam (മലയാളം)",
  "Kannada (ಕನ್ನಡ)",
  "Bengali (বাংলা)",
  "Marathi (मराठी)",
  "Gujarati (ગુજરાતી)",
  "Punjabi (ਪੰਜਾਬੀ)",
  "Urdu (اردو)",
  "Odia (ଓଡ଼ିଆ)",
  "Assamese (অসমীয়া)",
  "Bhojpuri (भोजपुरी)",
  "Spanish (Español)",
  "French (Français)",
  "German (Deutsch)",
  "Arabic (العربية)"
];

// --- Helper: Play Alarm Sound ---
const playAlarmSound = () => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime); // A5
    osc.frequency.setValueAtTime(1760, ctx.currentTime + 0.1); // A6
    osc.frequency.setValueAtTime(880, ctx.currentTime + 0.2); // A5
    
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);

    osc.start();
    osc.stop(ctx.currentTime + 0.6);
};


// --- Sub-components for Cleaner Code ---

const MedicalDisclaimer: React.FC = () => (
    <div className="bg-gray-100 border-t border-gray-200 py-6 px-4 text-center mt-auto">
        <p className="text-xs text-gray-500 max-w-3xl mx-auto leading-relaxed">
            <strong className="block text-gray-700 mb-1">MEDICAL DISCLAIMER</strong>
            This application is for educational and informational purposes only and is not a substitute for professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
            If you think you may have a medical emergency, call your doctor or emergency services immediately.
        </p>
    </div>
);

const Splash: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-medical-teal to-medical-navy text-white overflow-hidden relative">
    {/* Background Decorative Elements */}
    <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
    <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-medical-emerald/20 rounded-full blur-3xl"></div>

    {/* Brand Logo */}
    <div className="relative w-32 h-32 mb-8 z-10">
        {/* Rotating back layers */}
        <div className="absolute inset-0 bg-white/20 rounded-3xl rotate-12 animate-pulse"></div>
        <div className="absolute inset-0 bg-white/20 rounded-3xl -rotate-6 animate-pulse delay-100"></div>
        
        {/* Main Logo Container */}
        <div className="relative w-full h-full bg-gradient-to-br from-white to-medical-light rounded-2xl shadow-2xl flex items-center justify-center transform hover:scale-105 transition-transform duration-500 border-4 border-white/30 backdrop-blur-md">
            <Heart size={64} className="text-medical-teal drop-shadow-lg fill-medical-teal/10" strokeWidth={2.5} />
            <div className="absolute bottom-6 right-6 bg-medical-accent rounded-full p-1.5 shadow-md border-2 border-white">
                <Activity size={16} className="text-white" strokeWidth={3} />
            </div>
        </div>
    </div>

    <h1 className="text-6xl font-extrabold tracking-tight drop-shadow-sm z-10 flex items-center gap-1">
      Health<span className="text-medical-emerald">Mate</span>
    </h1>
    <p className="mt-4 text-medical-light text-xl font-medium opacity-90 tracking-wide z-10 bg-black/10 px-6 py-2 rounded-full border border-white/10 backdrop-blur-sm">
      Know your health, Own your health
    </p>
  </div>
);

const Login: React.FC<{ onComplete: (info: { patient: string; caretaker: string; caretakerPhone: string }) => void }> = ({ onComplete }) => {
  const [email, setEmail] = useState('');
  const [caretakerEmail, setCaretakerEmail] = useState('');
  const [caretakerPhone, setCaretakerPhone] = useState('');
  const [error, setError] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if(email.trim() && caretakerEmail.trim() && caretakerPhone.trim()) {
        onComplete({ patient: email, caretaker: caretakerEmail, caretakerPhone: caretakerPhone });
    } else {
        setError('All fields including Caretaker Phone are required.');
    }
  };

  const handleGuestLogin = () => {
    onComplete({ 
        patient: 'guest_patient@example.com', 
        caretaker: 'guest_caretaker@example.com',
        caretakerPhone: '9876543210' 
    });
  };

  return (
    <div className="min-h-screen bg-medical-light flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-64 h-64 bg-medical-teal/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-medical-accent/10 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>

      <div className="bg-white/80 backdrop-blur-lg p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-white/50 relative z-10">
        <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-medical-teal to-medical-emerald mb-6 shadow-xl text-white transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <User size={40} className="drop-shadow-md" />
            </div>
            <h2 className="text-3xl font-bold text-medical-navy">Welcome Back</h2>
            <p className="text-gray-500 mt-2">Sign in to access your health guide</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Patient Gmail <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(''); }}
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal focus:border-transparent focus:outline-none transition-all shadow-sm"
              placeholder="patient@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Caretaker Gmail <span className="text-red-500">*</span></label>
            <input 
              type="email" 
              value={caretakerEmail}
              onChange={(e) => { setCaretakerEmail(e.target.value); setError(''); }}
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal focus:border-transparent focus:outline-none transition-all shadow-sm"
              placeholder="caretaker@gmail.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Caretaker Phone <span className="text-red-500">*</span></label>
            <input 
              type="tel" 
              value={caretakerPhone}
              onChange={(e) => { setCaretakerPhone(e.target.value); setError(''); }}
              className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal focus:border-transparent focus:outline-none transition-all shadow-sm"
              placeholder="e.g. 9876543210"
            />
            {error && <p className="text-medical-accent text-sm mt-2 font-medium flex items-center gap-1"><AlertTriangle size={12}/> {error}</p>}
          </div>
          <button 
            type="submit"
            className="w-full bg-gradient-to-r from-medical-teal to-medical-tealDark text-white py-4 rounded-xl font-bold hover:shadow-lg hover:translate-y-[-2px] transition-all duration-300 shadow-md flex items-center justify-center gap-2 mt-2"
          >
            Continue <ChevronRight size={20}/>
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between gap-4">
             <div className="h-px bg-gray-200 flex-1"></div>
             <span className="text-xs font-bold text-gray-400 uppercase">Or</span>
             <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        <button 
            type="button"
            onClick={handleGuestLogin}
            className="w-full mt-6 bg-white border-2 border-gray-100 text-gray-600 py-3 rounded-xl font-bold hover:bg-gray-50 hover:border-gray-200 transition-all shadow-sm flex items-center justify-center gap-2"
        >
            <Users size={18} /> Continue as Guest
        </button>
      </div>
    </div>
  );
};

const DoctorForm: React.FC<{ onSubmit: (data: PatientData) => void }> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<PatientData>({
    patientName: '',
    age: '',
    gender: 'Male',
    language: '',
    location: '',
    prescriptionImage: '',
    reportImage: ''
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [reportPreviewUrl, setReportPreviewUrl] = useState<string | null>(null);
  const [filteredRegions, setFilteredRegions] = useState<string[]>([]);
  const [showRegionSuggestions, setShowRegionSuggestions] = useState(false);
  const [filteredLanguages, setFilteredLanguages] = useState<string[]>([]);
  const [showLanguageSuggestions, setShowLanguageSuggestions] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, location: val }));
    
    if (val.trim()) {
        const matches = INDIAN_LOCATIONS.filter(loc => 
            loc.toLowerCase().includes(val.toLowerCase())
        );
        setFilteredRegions(matches);
    } else {
        setFilteredRegions(INDIAN_LOCATIONS);
    }
    setShowRegionSuggestions(true);
  };

  const selectRegion = (region: string) => {
      setFormData(prev => ({ ...prev, location: region }));
      setShowRegionSuggestions(false);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFormData(prev => ({ ...prev, language: val }));
    
    if (val.trim()) {
        const matches = LANGUAGES_LIST.filter(lang => 
            lang.toLowerCase().startsWith(val.toLowerCase())
        );
        setFilteredLanguages(matches);
    } else {
        setFilteredLanguages(LANGUAGES_LIST);
    }
    setShowLanguageSuggestions(true);
  };

  const selectLanguage = (lang: string) => {
      setFormData(prev => ({ ...prev, language: lang }));
      setShowLanguageSuggestions(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreviewUrl(result);
        setFormData(prev => ({ ...prev, prescriptionImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReportUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setReportPreviewUrl(result);
        setFormData(prev => ({ ...prev, reportImage: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreviewUrl(null);
    setFormData(prev => ({ ...prev, prescriptionImage: '' }));
  };

  const clearReportImage = () => {
    setReportPreviewUrl(null);
    setFormData(prev => ({ ...prev, reportImage: '' }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.prescriptionImage) {
        alert("Please upload a prescription photo to proceed.");
        return;
    }
    if (!formData.age) {
        alert("Please enter the patient's age to generate age-appropriate content.");
        return;
    }
    if (!formData.location) {
        alert("Please select a location/region to receive local food recommendations.");
        return;
    }
    const nameInput = formData.patientName.trim();
    const finalName = nameInput.length > 0 ? nameInput : 'Guest Patient';
    const finalData = {
        ...formData,
        patientName: finalName,
        age: formData.age.trim(),
        location: formData.location.trim(),
        language: formData.language.trim() || 'English'
    };
    onSubmit(finalData);
  };

  return (
    <div className="min-h-screen bg-medical-light p-4 md:p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-xl border border-gray-100 relative">
        <div className="bg-gradient-to-r from-medical-navy to-slate-800 p-8 text-white flex items-center gap-4 relative overflow-hidden rounded-t-3xl">
            <div className="absolute right-0 top-0 w-64 h-64 bg-medical-teal opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-sm shadow-inner">
              <Stethoscope size={32} className="text-medical-teal" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">New Assessment</h2>
              <p className="text-gray-300 text-sm">Upload a prescription & report to generate a care plan</p>
            </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <h3 className="text-lg font-bold text-medical-teal flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-medical-teal/10 flex items-center justify-center">
                    <ImageIcon size={18} /> 
                    </div>
                    Prescription <span className="text-medical-accent text-sm ml-auto font-normal flex items-center gap-1"><AlertTriangle size={12}/> Required</span>
                </h3>
                
                {!previewUrl ? (
                    <div className="border-3 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-medical-light/50 hover:border-medical-teal transition-all cursor-pointer relative group bg-gray-50 h-64">
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="bg-white p-4 rounded-full mb-4 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                            <Upload size={32} className="text-medical-teal" />
                        </div>
                        <p className="text-gray-800 font-bold">Upload Prescription</p>
                        <p className="text-xs text-gray-500 mt-1">Clear image required</p>
                    </div>
                ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg group h-64">
                        <img src={previewUrl} alt="Prescription Preview" className="w-full h-full object-cover object-center" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button type="button" onClick={clearImage} className="bg-medical-accent text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors shadow-lg font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <Trash2 size={16} /> Remove
                        </button>
                        </div>
                    </div>
                )}
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-bold text-blue-600 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <FileBarChart size={18} /> 
                    </div>
                    Lab Report <span className="text-gray-400 text-sm ml-auto font-normal">(Optional)</span>
                </h3>
                {!reportPreviewUrl ? (
                    <div className="border-3 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center text-center hover:bg-blue-50 hover:border-blue-400 transition-all cursor-pointer relative group bg-gray-50 h-64">
                        <input type="file" accept="image/*" onChange={handleReportUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className="bg-white p-4 rounded-full mb-4 shadow-sm group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                            <Upload size={32} className="text-blue-500" />
                        </div>
                        <p className="text-gray-800 font-bold">Upload Lab Report</p>
                        <p className="text-xs text-gray-500 mt-1">Supports extra context</p>
                    </div>
                ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-gray-200 shadow-lg group h-64">
                        <img src={reportPreviewUrl} alt="Report Preview" className="w-full h-full object-cover object-center" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                        <button type="button" onClick={clearReportImage} className="bg-medical-accent text-white px-4 py-2 rounded-full hover:bg-red-600 transition-colors shadow-lg font-bold flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <Trash2 size={16} /> Remove
                        </button>
                        </div>
                    </div>
                )}
            </div>
          </div>

          <div className="border-t border-gray-100"></div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                 <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <User size={18} />
                </div>
                 Patient Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Patient Name</label>
                    <input name="patientName" value={formData.patientName} onChange={handleChange} type="text" className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal focus:border-transparent outline-none transition-all" placeholder="Guest Patient (Default)" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Age <span className="text-red-500">*</span></label>
                        <input name="age" value={formData.age} onChange={handleChange} type="number" className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal focus:border-transparent outline-none transition-all" placeholder="45" />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Gender</label>
                        <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal focus:border-transparent outline-none transition-all">
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Location / District <span className="text-red-500">*</span></label>
                    <div className="relative">
                        <MapPin className="absolute left-4 top-3.5 text-gray-400" size={18}/>
                        <input 
                            name="location" 
                            value={formData.location} 
                            onChange={handleRegionChange} 
                            onFocus={() => { 
                                setFilteredRegions(formData.location ? INDIAN_LOCATIONS.filter(l => l.toLowerCase().includes(formData.location.toLowerCase())) : INDIAN_LOCATIONS);
                                setShowRegionSuggestions(true);
                            }}
                            onBlur={() => setTimeout(() => setShowRegionSuggestions(false), 200)}
                            type="text" 
                            autoComplete="off"
                            className="w-full pl-11 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal focus:border-transparent outline-none transition-all placeholder-gray-400" 
                            placeholder="Search State or District (e.g. Assam, Chennai)" 
                        />
                        {showRegionSuggestions && filteredRegions.length > 0 && (
                            <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-gray-50 animate-fade-in">
                                {filteredRegions.map((region, idx) => (
                                    <li key={idx} onMouseDown={() => selectRegion(region)} className="px-4 py-3 hover:bg-medical-light cursor-pointer text-sm font-medium text-gray-700 hover:text-medical-teal transition-colors">
                                        {region}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5 ml-1">Language</label>
                    <div className="relative">
                        <Globe className="absolute left-4 top-3.5 text-gray-400" size={18}/>
                        <input 
                            name="language" 
                            value={formData.language} 
                            onChange={handleLanguageChange} 
                            onFocus={() => { 
                                setFilteredLanguages(formData.language ? LANGUAGES_LIST.filter(l => l.toLowerCase().startsWith(formData.language.toLowerCase())) : LANGUAGES_LIST);
                                setShowLanguageSuggestions(true);
                            }}
                            onBlur={() => setTimeout(() => setShowLanguageSuggestions(false), 200)}
                            type="text" 
                            autoComplete="off"
                            className="w-full pl-11 pr-5 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-medical-teal focus:border-transparent outline-none transition-all placeholder-gray-400"
                            placeholder="Defaults to English"
                        />
                        {showLanguageSuggestions && filteredLanguages.length > 0 && (
                            <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-gray-100 rounded-xl shadow-lg max-h-60 overflow-y-auto divide-y divide-gray-50 animate-fade-in">
                                {filteredLanguages.map((lang, idx) => (
                                    <li key={idx} onMouseDown={() => selectLanguage(lang)} className="px-4 py-3 hover:bg-medical-light cursor-pointer text-sm font-medium text-gray-700 hover:text-medical-teal transition-colors">
                                        {lang}
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
          </div>

          <button 
            type="submit" 
            className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-lg flex items-center justify-center gap-2 transform hover:-translate-y-1
                ${formData.prescriptionImage 
                    ? 'bg-gradient-to-r from-medical-teal to-medical-tealDark text-white hover:shadow-medical-teal/30' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'}`}
          >
           <Sparkles size={20} /> Analyze & Generate Plan <ChevronRight size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-medical-light flex flex-col items-center justify-center p-6 text-center">
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-medical-teal blur-2xl opacity-20 animate-pulse rounded-full"></div>
        <Loader2 size={64} className="text-medical-teal animate-spin relative z-10" />
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Analyzing Health Data</h2>
      <p className="text-gray-500 max-w-md animate-pulse">
        Our AI is reading the prescription, identifying medications, and preparing a personalized care plan...
      </p>
  </div>
);

const ReportView: React.FC<{ data: AIResponse; patientData: PatientData; onBack: () => void }> = ({ data, patientData, onBack }) => {
    return (
        <div className="min-h-screen bg-gray-50 p-6 flex flex-col items-center">
             {/* Action Bar */}
            <div className="w-full max-w-4xl flex justify-between items-center mb-6 no-print">
                <button onClick={onBack} className="flex items-center gap-2 text-gray-600 hover:text-medical-navy bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 transition-colors">
                    <ChevronLeft size={20} /> Back to Dashboard
                </button>
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-medical-navy text-white px-5 py-2 rounded-xl shadow-md hover:bg-slate-800 transition-all">
                    <Printer size={20} /> Print Report
                </button>
            </div>

            {/* Printable A4 Container */}
            <div className="bg-white w-full max-w-4xl shadow-lg p-10 print:shadow-none print:w-full print:p-0">
                {/* Report Header */}
                <div className="border-b-2 border-medical-teal pb-6 mb-8 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 text-medical-teal mb-1">
                             <Heart className="fill-medical-teal" size={24}/>
                             <span className="font-bold text-2xl tracking-tight text-medical-navy">HealthMate AI</span>
                        </div>
                        <p className="text-sm text-gray-500">Personalized Medical Care Plan</p>
                    </div>
                    <div className="text-right">
                        <h2 className="text-3xl font-bold text-medical-navy">{data.condition}</h2>
                        <p className="text-sm text-gray-500 mt-1">Generated on {new Date().toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Patient Info Grid */}
                <div className="bg-gray-50 rounded-xl p-6 border border-gray-100 mb-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-xs uppercase font-bold text-gray-400 mb-1">Patient Name</p>
                        <p className="font-bold text-gray-800">{patientData.patientName}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase font-bold text-gray-400 mb-1">Age / Gender</p>
                        <p className="font-bold text-gray-800">{patientData.age} / {patientData.gender}</p>
                    </div>
                    <div>
                        <p className="text-xs uppercase font-bold text-gray-400 mb-1">Region</p>
                        <p className="font-bold text-gray-800">{patientData.location}</p>
                    </div>
                     <div>
                        <p className="text-xs uppercase font-bold text-gray-400 mb-1">Language</p>
                        <p className="font-bold text-gray-800">{patientData.language}</p>
                    </div>
                </div>

                {/* Detailed Analysis Section */}
                {data.detailed_analysis && (
                    <div className="mb-8">
                        <h3 className="text-lg font-bold text-medical-navy border-b border-gray-200 pb-2 mb-4">Condition Analysis</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-medical-teal font-bold text-sm uppercase">What is it?</h4>
                                    <p className="text-gray-700 leading-relaxed">{data.detailed_analysis.what_is_it}</p>
                                </div>
                                <div>
                                    <h4 className="text-orange-500 font-bold text-sm uppercase">Why it happens?</h4>
                                    <p className="text-gray-700 leading-relaxed">{data.detailed_analysis.why_it_happened}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-purple-600 font-bold text-sm uppercase">Body Part Affected</h4>
                                    <p className="text-gray-700 leading-relaxed">{data.detailed_analysis.body_part_affected}</p>
                                </div>
                                <div>
                                    <h4 className="text-green-600 font-bold text-sm uppercase">Treatment Plan</h4>
                                    <p className="text-gray-700 leading-relaxed">{data.detailed_analysis.how_treatment_helps}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Medications Table */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-medical-navy border-b border-gray-200 pb-2 mb-4">Medication Schedule</h3>
                    <div className="overflow-hidden rounded-lg border border-gray-200">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-100 text-gray-600 font-bold uppercase">
                                <tr>
                                    <th className="p-3">Medicine</th>
                                    <th className="p-3">Purpose</th>
                                    <th className="p-3">Dosage</th>
                                    <th className="p-3">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.medications.map((med, i) => (
                                    <tr key={i}>
                                        <td className="p-3 font-medium text-gray-900">{med.name}</td>
                                        <td className="p-3 text-gray-600">{med.purpose}</td>
                                        <td className="p-3 text-gray-600">{med.dosage}</td>
                                        <td className="p-3 text-medical-teal font-bold">{med.schedule_time} ({med.timing})</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* Med Tips */}
                    <div className="mt-3 text-xs text-gray-500 bg-blue-50 p-3 rounded-lg">
                        <strong>Safety Tips:</strong> {data.medication_tips.join(' • ')}
                    </div>
                </div>

                {/* Diet & Lifestyle Grid */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                        <h3 className="text-lg font-bold text-medical-navy border-b border-gray-200 pb-2 mb-4">Recommended Diet</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                            {data.regional_food_list.map((food, i) => (
                                <li key={i}>{food}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                         <h3 className="text-lg font-bold text-medical-navy border-b border-gray-200 pb-2 mb-4">Lifestyle Advice</h3>
                        <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                             {data.lifestyle_advice.map((adv, i) => (
                                <li key={i}>{adv}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Red Zone Alerts */}
                 {(data.red_zone_alerts.length > 0) && (
                    <div className="border border-red-200 bg-red-50 rounded-xl p-5 mb-8">
                        <h3 className="text-red-700 font-bold flex items-center gap-2 mb-3">
                            <AlertTriangle size={20}/> Emergency Warning Signs
                        </h3>
                         <ul className="space-y-2 text-sm text-red-800">
                             {data.red_zone_alerts.map((alert, i) => (
                                <li key={i} className="flex gap-2">
                                    <span>•</span> {alert}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                
                <div className="text-center text-xs text-gray-400 mt-10 pt-4 border-t border-gray-100">
                    <p>Generated by HealthMate AI. Consult your doctor for medical advice.</p>
                </div>
            </div>
        </div>
    );
};

const LifestyleView: React.FC<{ data: AIResponse; patientData: PatientData; onBack: () => void }> = ({ data, patientData, onBack }) => {
  return (
    <div className="min-h-screen bg-green-50/50 pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
            <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                <ChevronLeft size={24} />
            </button>
            <div>
                <h1 className="font-bold text-gray-800 leading-tight">Diet & Lifestyle</h1>
                <p className="text-xs text-gray-500">Holistic wellness plan</p>
            </div>
        </div>
      </header>
      
      <main className="p-4 max-w-3xl mx-auto space-y-6">
        {/* Diet Section */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Utensils size={20} className="text-medical-teal"/> Diet ({patientData.location})
            </h3>
            <div className="grid grid-cols-1 gap-3">
                {data.regional_food_list?.map((food, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-green-50/50 rounded-xl border border-green-100">
                        <span className="text-xl">🥗</span>
                        <span className="font-bold text-gray-700">{food}</span>
                    </div>
                ))}
            </div>
        </div>

        {/* Good Habits (Lifestyle Advice) */}
        {data.lifestyle_advice && data.lifestyle_advice.length > 0 && (
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Sparkles size={20} className="text-purple-500"/> Good Habits
                </h3>
                <ul className="space-y-3">
                    {data.lifestyle_advice.map((adv, i) => (
                        <li key={i} className="flex gap-3 items-start bg-purple-50 p-3 rounded-xl border border-purple-100">
                            <CheckCircle size={18} className="text-purple-600 mt-0.5 shrink-0" />
                            <span className="text-sm font-medium text-gray-700">{adv}</span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
        
        {/* Activities */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Footprints size={20} className="text-orange-500"/> Recommended Activities
            </h3>
            <ul className="space-y-3">
                {data.recommended_activities?.map((act, i) => (
                    <li key={i} className="flex gap-3 items-start">
                        <div className="mt-1 bg-orange-100 p-1 rounded-full shrink-0">
                            <Activity size={12} className="text-orange-600" />
                        </div>
                        <span className="text-sm text-gray-700">{act}</span>
                    </li>
                ))}
            </ul>
        </div>

        {/* Do's & Don'ts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-emerald-50 p-5 rounded-2xl border border-emerald-100">
                <h4 className="font-bold text-emerald-800 mb-3 flex items-center gap-2"><CheckCircle size={18}/> Do's</h4>
                <ul className="space-y-2 text-sm text-emerald-900">
                    {data.dos?.slice(0, 5).map((item, i) => <li key={i} className="flex gap-2 items-start"><span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500 shrink-0"></span>{item}</li>)}
                </ul>
            </div>
            <div className="bg-red-50 p-5 rounded-2xl border border-red-100">
                <h4 className="font-bold text-red-800 mb-3 flex items-center gap-2"><XCircle size={18}/> Don'ts</h4>
                <ul className="space-y-2 text-sm text-red-900">
                    {data.donts?.slice(0, 5).map((item, i) => <li key={i} className="flex gap-2 items-start"><span className="mt-1.5 w-1 h-1 rounded-full bg-red-500 shrink-0"></span>{item}</li>)}
                </ul>
            </div>
        </div>
      </main>
    </div>
  );
};

const CareTeamAlerts: React.FC<{ 
    patientEmail: string; 
    caretakerEmail: string;
    caretakerPhone: string;
    condition: string;
    patientName: string;
    medications: Medication[];
}> = ({ patientEmail, caretakerEmail, caretakerPhone, condition, patientName, medications }) => {
    const [active, setActive] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleActivate = () => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setActive(true);
            alert(`✓ Reminders Activated!\n\n• Daily Meds: ${patientEmail}\n• Daily Reports: ${caretakerEmail}\n• SMS Alerts: ${caretakerPhone}`);
        }, 1500);
    };

    const handleSendReportNow = () => {
        const subject = encodeURIComponent(`Daily Health Report: ${condition} - ${patientName}`);
        const body = encodeURIComponent(
`Daily Health Update for ${patientName}

Condition: ${condition}

Current Medications Status:
${medications.map(m => `- ${m.name}: Scheduled for ${m.schedule_time}`).join('\n')}

Vitals & Symptoms:
- No emergency symptoms reported today.
- Diet plan followed.

This is an automated report from HealthMate AI.`
        );
        window.open(`mailto:${caretakerEmail}?subject=${subject}&body=${body}`);
    };

    const handleWhatsAppReport = () => {
        const cleanPhone = caretakerPhone.replace(/\D/g, '');
        const message = `*Daily Health Update for ${patientName}* 🩺
        
*Condition:* ${condition}

*Medications:*
${medications.map(m => `• ${m.name} (${m.schedule_time})`).join('\n')}

✅ Patient is stable
✅ Diet followed

_Sent via HealthMate AI_`;
        
        window.open(`https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`, '_blank');
    };

    return (
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg mb-8">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-xl flex items-center gap-2">
                    <BellRing size={24} className="text-yellow-300" /> Care Team Alerts
                </h3>
                {active && <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold border border-white/30 flex items-center gap-1">
                    <CheckCircle size={12} /> Active
                </span>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                        <User size={16} className="text-indigo-200" />
                        <span className="text-xs font-bold uppercase text-indigo-100">Patient (Daily Meds)</span>
                    </div>
                    <p className="font-medium truncate text-sm">{patientEmail}</p>
                </div>
                 <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                        <Users size={16} className="text-purple-200" />
                        <span className="text-xs font-bold uppercase text-purple-100">Caretaker (Daily Report)</span>
                    </div>
                    <p className="font-medium truncate text-sm">{caretakerEmail}</p>
                </div>
                <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                    <div className="flex items-center gap-2 mb-1">
                        <Phone size={16} className="text-pink-200" />
                        <span className="text-xs font-bold uppercase text-pink-100">Caretaker Phone</span>
                    </div>
                    <p className="font-medium truncate text-sm">{caretakerPhone}</p>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-3">
                <button 
                    onClick={handleActivate}
                    disabled={active || loading}
                    className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                        ${active 
                            ? 'bg-green-500 text-white cursor-default' 
                            : 'bg-white text-indigo-600 hover:bg-gray-50'
                        }
                    `}
                >
                    {loading ? <Loader2 size={20} className="animate-spin" /> : active ? 'Alerts Enabled' : 'Enable Daily Reminders'}
                </button>
                
                <div className="flex gap-2">
                    <button 
                        onClick={handleSendReportNow}
                        className="flex-1 md:flex-none px-4 py-3 rounded-xl font-bold bg-indigo-700/50 hover:bg-indigo-700 border border-white/20 transition-colors flex items-center justify-center gap-2"
                        title="Send Daily Email Report"
                    >
                        <Mail size={20} /> Email Report
                    </button>
                    <button 
                        onClick={handleWhatsAppReport}
                        className="flex-1 md:flex-none px-4 py-3 rounded-xl font-bold bg-green-600/80 hover:bg-green-600 border border-white/20 transition-colors flex items-center justify-center gap-2"
                        title="Send Daily WhatsApp Update"
                    >
                        <MessageCircle size={20} /> WhatsApp
                    </button>
                </div>
            </div>
            {!active && <p className="text-xs text-indigo-100 mt-3 text-center opacity-80">
                *Activates daily tablet reminders via Email/SMS and sends health summary daily to caretaker.
            </p>}
        </div>
    );
};

const Dashboard: React.FC<{ 
    data: AIResponse; 
    patientData: PatientData; 
    contactInfo: { patient: string; caretaker: string; caretakerPhone: string };
    onBack: () => void; 
    onViewReport: () => void; 
    onViewLifestyle: () => void 
}> = ({ data, patientData, contactInfo, onBack, onViewReport, onViewLifestyle }) => {
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoadingAudio, setIsLoadingAudio] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const playAudio = async () => {
        if (isPlaying) {
            audioRef.current?.pause();
            setIsPlaying(false);
            return;
        }

        if (!audioUrl) {
            setIsLoadingAudio(true);
            try {
                const audioData = await generateTTSAudio(data.tts_script);
                const url = `data:audio/mp3;base64,${audioData}`;
                setAudioUrl(url);
                setTimeout(() => {
                    if (audioRef.current) {
                        audioRef.current.play();
                        setIsPlaying(true);
                    }
                }, 100);
            } catch (e) {
                console.error("Failed to generate audio", e);
                alert("Could not generate audio at this time.");
            } finally {
                setIsLoadingAudio(false);
            }
        } else {
            audioRef.current?.play();
            setIsPlaying(true);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Header */}
            <header className="bg-white sticky top-0 z-40 border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full text-gray-600">
                        <ChevronLeft size={24} />
                    </button>
                    <div>
                        <h1 className="font-bold text-gray-800 leading-tight">{data.condition}</h1>
                        <p className="text-xs text-gray-500">for {patientData.patientName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button onClick={onViewReport} className="hidden md:flex items-center gap-2 bg-white text-medical-teal border border-medical-teal px-4 py-2 rounded-full text-sm font-bold hover:bg-medical-light transition-colors">
                        <FileText size={16} /> View Care Plan
                    </button>
                    <div className="w-10 h-10 rounded-full bg-medical-teal/10 flex items-center justify-center text-medical-teal font-bold">
                        {patientData.patientName.charAt(0)}
                    </div>
                </div>
            </header>

            <main className="p-4 max-w-3xl mx-auto space-y-8">
                
                {/* 1. Avatar & Structured Explanation Section */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center">
                     <ToyAvatar isTalking={isPlaying} emotion="happy" />
                     
                     <div className="mt-6 w-full space-y-4">
                        <h2 className="text-xl font-bold text-gray-800 flex items-center justify-center gap-2">
                            Dr. Bear's Explanation <Volume2 size={20} className="text-medical-teal"/>
                        </h2>
                        
                        {/* Structured Detailed Cards */}
                        {data.detailed_analysis ? (
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                                <div className="bg-teal-50 p-4 rounded-xl border border-teal-100 hover:shadow-md transition-shadow">
                                    <h3 className="font-nunito font-bold text-medical-teal mb-2 flex items-center gap-2">
                                        <Info size={16} /> What is it?
                                    </h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{data.detailed_analysis.what_is_it}</p>
                                </div>
                                <div className="bg-orange-50 p-4 rounded-xl border border-orange-100 hover:shadow-md transition-shadow">
                                    <h3 className="font-nunito font-bold text-orange-500 mb-2 flex items-center gap-2">
                                        <AlertTriangle size={16} /> Why did it happen?
                                    </h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{data.detailed_analysis.why_it_happened}</p>
                                </div>
                                <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 hover:shadow-md transition-shadow">
                                    <h3 className="font-nunito font-bold text-purple-600 mb-2 flex items-center gap-2">
                                        <Activity size={16} /> Body Part Affected
                                    </h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{data.detailed_analysis.body_part_affected}</p>
                                </div>
                                <div className="bg-green-50 p-4 rounded-xl border border-green-100 hover:shadow-md transition-shadow">
                                    <h3 className="font-nunito font-bold text-green-600 mb-2 flex items-center gap-2">
                                        <Sparkles size={16} /> How treatment helps
                                    </h3>
                                    <p className="text-sm text-gray-700 leading-relaxed">{data.detailed_analysis.how_treatment_helps}</p>
                                </div>
                             </div>
                        ) : (
                            <div className="text-sm text-gray-600 mb-4 bg-gray-50 p-4 rounded-xl border border-gray-100 text-left leading-relaxed shadow-inner">
                                 <p className="whitespace-pre-line">{data.education_text}</p>
                            </div>
                        )}

                        <button 
                            onClick={playAudio}
                            disabled={isLoadingAudio}
                            className={`flex items-center justify-center gap-2 w-full py-3 rounded-xl font-bold text-white transition-all shadow-md mt-4
                                ${isPlaying ? 'bg-orange-400 hover:bg-orange-500' : 'bg-medical-teal hover:bg-medical-tealDark'}
                            `}
                        >
                            {isLoadingAudio ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : isPlaying ? (
                                <><Pause size={20} /> Pause Explanation</>
                            ) : (
                                <><Volume2 size={20} /> Listen to Dr. Bear</>
                            )}
                        </button>
                        <audio 
                            ref={audioRef} 
                            src={audioUrl || undefined} 
                            onEnded={() => setIsPlaying(false)} 
                            onPause={() => setIsPlaying(false)}
                            className="hidden" 
                        />
                     </div>
                </div>

                {/* Notification Panel */}
                <CareTeamAlerts 
                    patientEmail={contactInfo.patient}
                    caretakerEmail={contactInfo.caretaker}
                    caretakerPhone={contactInfo.caretakerPhone}
                    condition={data.condition}
                    patientName={patientData.patientName}
                    medications={data.medications}
                />

                {/* Mobile Report Button */}
                <button onClick={onViewReport} className="md:hidden w-full flex items-center justify-center gap-2 bg-white text-medical-navy border-2 border-medical-navy/10 px-4 py-4 rounded-xl font-bold shadow-sm hover:bg-gray-50 transition-colors">
                    <FileText size={20} className="text-medical-teal" /> View Printable Care Plan <ChevronRight size={18} className="text-gray-400"/>
                </button>

                {/* 2. Red Zone Alerts (Conditional) */}
                {(data.red_zone_alerts?.length > 0 || data.warnings?.length > 0) && (
                    <div className="bg-red-50 border border-red-100 rounded-2xl p-6 shadow-sm">
                        <h3 className="text-red-600 font-bold flex items-center gap-2 mb-4 text-lg">
                            <Siren size={24} /> Emergency Signs
                        </h3>
                        <ul className="space-y-3">
                            {[...(data.red_zone_alerts || []), ...(data.warnings || [])].map((alert, i) => (
                                <li key={i} className="flex gap-3 text-red-800 bg-white/60 p-3 rounded-xl border border-red-100/50">
                                    <AlertTriangle size={20} className="shrink-0 mt-0.5 text-red-500" />
                                    <span className="font-medium">{alert}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 3. Medications Section */}
                <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="bg-purple-100 p-2 rounded-lg"><Pill size={20} className="text-purple-600"/></div>
                        Medication Guide
                    </h3>
                    <div className="space-y-4">
                        {data.medications?.map((med, i) => (
                            <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
                                <div className="absolute top-0 right-0 p-3 opacity-5 group-hover:opacity-10 transition-opacity">
                                    <Pill size={80} className="text-medical-teal" />
                                </div>
                                <h4 className="font-bold text-xl text-medical-navy mb-1">{med.name}</h4>
                                <p className="text-sm text-gray-500 mb-4">{med.purpose}</p>
                                
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-blue-50 text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1 border border-blue-100">
                                        <Clock size={12} /> {med.schedule_time}
                                    </span>
                                    <span className="bg-purple-50 text-purple-700 text-xs font-bold px-3 py-1.5 rounded-full border border-purple-100">
                                        {med.dosage}
                                    </span>
                                    <span className="bg-orange-50 text-orange-700 text-xs font-bold px-3 py-1.5 rounded-full border border-orange-100">
                                        {med.timing}
                                    </span>
                                </div>
                            </div>
                        ))}
                        
                        {/* Safety Tips Compact */}
                        <div className="bg-blue-50/80 p-5 rounded-2xl border border-blue-100">
                            <h4 className="font-bold text-blue-800 text-sm mb-3 flex items-center gap-2">
                                <Info size={16}/> General Safety Tips
                            </h4>
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {data.medication_tips?.map((tip, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm text-blue-900">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 shrink-0"></div>
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* 4. Symptom Checker */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <div className="bg-indigo-100 p-2 rounded-lg"><Thermometer size={20} className="text-indigo-600"/></div>
                        Symptom Checker
                    </h3>
                    <div className="space-y-3">
                        {data.symptom_checker?.map((item, i) => (
                            <div key={i} className="flex gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                                <div className={`w-2 h-full rounded-full self-stretch shrink-0 ${
                                    item.severity === 'EMERGENCY' ? 'bg-red-500' : 
                                    item.severity === 'MODERATE' ? 'bg-orange-400' : 'bg-green-400'
                                }`} />
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-bold text-gray-800 text-lg">{item.symptom}</p>
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                                            item.severity === 'EMERGENCY' ? 'bg-red-100 text-red-700' : 
                                            item.severity === 'MODERATE' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                                        }`}>
                                            {item.severity}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600">{item.action}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 5. Diet & Lifestyle Link Card */}
                <div onClick={onViewLifestyle} className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-md text-white flex items-center justify-between cursor-pointer hover:shadow-lg transition-all transform hover:-translate-y-1">
                    <div>
                        <h3 className="text-xl font-bold mb-1">Diet & Lifestyle Plan</h3>
                        <p className="text-emerald-50 text-sm">Tap to view food, habits, and daily activities</p>
                    </div>
                    <div className="bg-white/20 p-3 rounded-full">
                        <Utensils size={24} className="text-white" />
                    </div>
                </div>

                {/* Footer Sources */}
                <div className="text-center pt-8 pb-4 border-t border-gray-200">
                    <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Verified Medical Sources</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        {data.sources?.map((source, i) => (
                            <span key={i} className="bg-white text-gray-500 px-3 py-1 rounded-full text-xs border border-gray-200 shadow-sm">
                                {source}
                            </span>
                        ))}
                    </div>
                </div>

                <MedicalDisclaimer />
            </main>
        </div>
    );
};

const App: React.FC = () => {
    const [view, setView] = useState<AppView>(AppView.SPLASH);
    const [patientData, setPatientData] = useState<PatientData | null>(null);
    const [aiResponse, setAiResponse] = useState<AIResponse | null>(null);
    const [contactInfo, setContactInfo] = useState<{ patient: string; caretaker: string; caretakerPhone: string }>({ patient: '', caretaker: '', caretakerPhone: '' });

    useEffect(() => {
        const timer = setTimeout(() => {
            setView(AppView.LOGIN);
        }, 3000);
        return () => clearTimeout(timer);
    }, []);

    const handleLoginComplete = (info: { patient: string; caretaker: string; caretakerPhone: string }) => {
        setContactInfo(info);
        setView(AppView.DOCTOR_FORM);
    };

    const handleDoctorFormSubmit = async (data: PatientData) => {
        setPatientData(data);
        setView(AppView.LOADING);
        
        try {
            const response = await generatePatientPlan(data);
            setAiResponse(response);
            setView(AppView.DASHBOARD);
        } catch (error) {
            console.error(error);
            alert("Failed to analyze data. Please try again.");
            setView(AppView.DOCTOR_FORM);
        }
    };

    const handleBack = () => {
        setView(AppView.DOCTOR_FORM);
        setAiResponse(null);
        setPatientData(null);
    };

    return (
        <div className="font-sans text-gray-900 bg-gray-50 min-h-screen">
            {view === AppView.SPLASH && <Splash />}
            {view === AppView.LOGIN && <Login onComplete={handleLoginComplete} />}
            {view === AppView.DOCTOR_FORM && <DoctorForm onSubmit={handleDoctorFormSubmit} />}
            {view === AppView.LOADING && <LoadingScreen />}
            {view === AppView.DASHBOARD && aiResponse && patientData && (
                <Dashboard 
                    data={aiResponse} 
                    patientData={patientData} 
                    contactInfo={contactInfo}
                    onBack={handleBack} 
                    onViewReport={() => setView(AppView.REPORT)} 
                    onViewLifestyle={() => setView(AppView.LIFESTYLE)}
                />
            )}
            {view === AppView.REPORT && aiResponse && patientData && (
                <ReportView 
                    data={aiResponse} 
                    patientData={patientData} 
                    onBack={() => setView(AppView.DASHBOARD)} 
                />
            )}
            {view === AppView.LIFESTYLE && aiResponse && patientData && (
                <LifestyleView 
                    data={aiResponse} 
                    patientData={patientData} 
                    onBack={() => setView(AppView.DASHBOARD)} 
                />
            )}
        </div>
    );
};

export default App;
