
import React, { useState } from 'react';
import { UserQuizData, Product } from '../types';
import { getAIPersonalizedRecommendation } from '../services/geminiService';

interface SkinQuizProps {
  availableProducts: Product[];
  onRecommendation: (recommendation: string, suggestedProducts: Product[]) => void;
}

const SkinQuiz: React.FC<SkinQuizProps> = ({ availableProducts, onRecommendation }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<UserQuizData>({
    skinType: '',
    concerns: [],
    sensitivity: ''
  });

  const skinTypes = ['Dry', 'Oily', 'Combination', 'Normal'];
  const concerns = ['Dryness', 'Irritation', 'Aging', 'Uneven Tone', 'Redness'];
  const sensitivityLevels = ['Not Sensitive', 'Mildly Sensitive', 'Very Sensitive'];

  const toggleConcern = (concern: string) => {
    setFormData(prev => ({
      ...prev,
      concerns: prev.concerns.includes(concern) 
        ? prev.concerns.filter(c => c !== concern)
        : [...prev.concerns, concern]
    }));
  };

  const handleFinish = async () => {
    setLoading(true);
    const result = await getAIPersonalizedRecommendation(formData, availableProducts);
    const suggested = availableProducts.filter(p => 
      result.products.some(name => p.name.toLowerCase().includes(name.toLowerCase()))
    );
    onRecommendation(result.recommendation, suggested.length > 0 ? suggested : [availableProducts[0]]);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-16 h-16 border-4 border-hannora-accent border-t-hannora-green rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-serif mb-2">Analyzing your unique profile...</h2>
        <p className="text-slate-500">Our AI is selecting the perfect botanical blend for you.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-hannora-light">
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <span className="text-xs font-bold uppercase tracking-widest text-hannora-green">Step {step} of 3</span>
          <div className="flex gap-1">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1 w-8 rounded-full ${i <= step ? 'bg-hannora-green' : 'bg-slate-100'}`} />
            ))}
          </div>
        </div>

        {step === 1 && (
          <div>
            <h2 className="text-3xl font-serif mb-6 text-slate-800">How would you describe your skin?</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skinTypes.map(type => (
                <button
                  key={type}
                  onClick={() => { setFormData({...formData, skinType: type}); setStep(2); }}
                  className={`p-6 rounded-2xl text-left border-2 transition-all ${formData.skinType === type ? 'border-hannora-green bg-hannora-light' : 'border-slate-100 hover:border-hannora-accent'}`}
                >
                  <span className="font-semibold">{type}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-3xl font-serif mb-6 text-slate-800">What are your main concerns?</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {concerns.map(concern => (
                <button
                  key={concern}
                  onClick={() => toggleConcern(concern)}
                  className={`p-4 rounded-2xl text-center border-2 transition-all ${formData.concerns.includes(concern) ? 'border-hannora-green bg-hannora-light' : 'border-slate-100 hover:border-hannora-accent'}`}
                >
                  <span className="text-sm font-medium">{concern}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setStep(3)}
              disabled={formData.concerns.length === 0}
              className="w-full bg-hannora-green text-white py-4 rounded-2xl font-bold disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-3xl font-serif mb-6 text-slate-800">How sensitive is your skin?</h2>
            <div className="flex flex-col gap-4 mb-8">
              {sensitivityLevels.map(level => (
                <button
                  key={level}
                  onClick={() => setFormData({...formData, sensitivity: level})}
                  className={`p-6 rounded-2xl text-left border-2 transition-all ${formData.sensitivity === level ? 'border-hannora-green bg-hannora-light' : 'border-slate-100 hover:border-hannora-accent'}`}
                >
                  <span className="font-semibold">{level}</span>
                </button>
              ))}
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(2)} className="flex-1 py-4 border-2 border-slate-200 rounded-2xl font-bold">Back</button>
              <button 
                onClick={handleFinish} 
                disabled={!formData.sensitivity}
                className="flex-[2] bg-hannora-green text-white py-4 rounded-2xl font-bold disabled:opacity-50"
              >
                Get My Ritual
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkinQuiz;
