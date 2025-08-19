import React, { useState, useContext } from 'react';
import { DiaryContext } from '../context/DiaryContext';
import { translations } from '../utils/translations';

const EmotionAnalysis = () => {
  const { diaries, language } = useContext(DiaryContext);
  const t = translations[language];
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);

  const analyzeEmotions = async () => {
    if (diaries.length === 0) {
      setAnalysis(language === 'zh' ? '暂无日记记录可供分析' : 'No diary entries available for analysis');
      return;
    }

    setLoading(true);
    
    const diaryTexts = diaries.map(diary => 
      `${diary.date}: ${diary.mood} - ${diary.content}`
    ).join('\n\n');

    try {
      const response = await fetch('https://api.deepseek.com/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer sk-9fa09df14a7c4e40ba393b81ad0fa69e'
        },
        body: JSON.stringify({
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: language === 'zh' 
                ? '你是一位专业的心理健康顾问。请分析用户的日记记录，识别情绪模式，并提供有建设性的建议来改善心理健康。请用温和、专业的语气回应。'
                : 'You are a professional mental health advisor. Please analyze the user\'s diary entries, identify emotional patterns, and provide constructive suggestions to improve mental health. Please respond with a gentle, professional tone.'
            },
            {
              role: 'user',
              content: language === 'zh' 
                ? `请分析以下日记记录中的情绪模式，并给出改善建议：\n\n${diaryTexts}`
                : `Please analyze the emotional patterns in the following diary entries and provide improvement suggestions:\n\n${diaryTexts}`
            }
          ],
          stream: false
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.choices[0].message.content);
      } else {
        throw new Error('API请求失败');
      }
    } catch (error) {
      setAnalysis(language === 'zh' ? '分析失败，请稍后再试。' : 'Analysis failed, please try again later.');
    }

    setLoading(false);
  };

  return (
    <div className="emotion-analysis">
      <div className="analysis-header">
        <h2>{language === 'zh' ? '情绪分析与建议' : 'Emotion Analysis & Suggestions'}</h2>
        <p className="analysis-desc">
          {language === 'zh' 
            ? '基于您的日记记录，AI将为您分析情绪模式并提供个性化建议'
            : 'Based on your diary entries, AI will analyze emotional patterns and provide personalized suggestions'
          }
        </p>
      </div>

      <div className="analysis-stats">
        <div className="stat-item">
          <span className="stat-number">{diaries.length}</span>
          <span className="stat-label">{language === 'zh' ? '日记条数' : 'Diary Entries'}</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{new Set(diaries.map(d => d.mood)).size}</span>
          <span className="stat-label">{language === 'zh' ? '情绪类型' : 'Emotion Types'}</span>
        </div>
      </div>

      <button 
        className="analyze-btn" 
        onClick={analyzeEmotions}
        disabled={loading || diaries.length === 0}
      >
        {loading 
          ? (language === 'zh' ? '分析中...' : 'Analyzing...') 
          : (language === 'zh' ? '开始分析' : 'Start Analysis')
        }
      </button>

      {analysis && (
        <div className="analysis-result">
          <h3>{language === 'zh' ? '分析结果' : 'Analysis Result'}</h3>
          <div className="analysis-content">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmotionAnalysis;