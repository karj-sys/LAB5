<template>
  <div class="container">
    <header class="app-header">
      <h1>Mood <span class="accent">Check-in</span></h1>
      <p class="subtitle">How is your mind today?</p>
    </header>

    <div class="card form-card">
      <div class="input-group">
        <label>Name</label>
        <input
          v-model="name"
          placeholder="Enter your name"
          :disabled="loading"
          class="input-field"
        />
      </div>
      
      <div class="input-group">
        <label>Your Mood</label>
        <textarea
          v-model="mood"
          placeholder="I'm feeling a bit..."
          :disabled="loading"
          class="input-field"
        ></textarea>
      </div>

      <div class="btn-group">
        <button
          @click="submitMood"
          :disabled="loading || !name || !mood"
          class="btn submit-btn"
        >
          <span v-if="loading" class="loader-text">✨ Processing...</span>
          <span v-else>Share with AI</span>
        </button>
      </div>

      <p v-if="error" class="error-msg">{{ error }}</p>
      
      <transition name="fade">
        <div v-if="aiMessage" class="ai-box">
          <div class="ai-badge">AI ADVISOR</div>
          <p>{{ aiMessage }}</p>
        </div>
      </transition>
    </div>

    <div class="card history-card">
      <div class="history-header">
        <h3>Recent Reflections</h3>
        <button @click="fetchHistory" class="btn refresh-btn">
          <span>↻</span> Refresh
        </button>
      </div>
      
      <div class="table-container">
        <table v-if="history.length > 0" class="history-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Mood</th>
              <th>AI Response</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in history" :key="index">
              <td class="font-bold">{{ entry.full_name }}</td>
              <td class="mood-text-cell">{{ entry.mood_text }}</td>
              <td class="ai-text-cell">{{ entry.ai_message }}</td>
            </tr>
          </tbody>
        </table>
        <div v-else class="empty-state">
          <p>No history found yet. Start the conversation!</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      name: '',
      mood: '',
      aiMessage: '',
      loading: false,
      error: null,
      history: []
    };
  },
  mounted() {
    this.fetchHistory();
  },
  methods: {
    async submitMood() {
      this.loading = true;
      this.error = null;
      this.aiMessage = ''; 
      try {
        const res = await api.post('/moods', {
          full_name: this.name,
          mood_text: this.mood
        });

        this.aiMessage = res.data.ai_message;
        this.mood = '';
        await this.fetchHistory();
      } catch (err) {
        this.error = "Failed to connect to server. Is the backend running?";
      } finally {
        this.loading = false;
      }
    },
    async fetchHistory() {
      try {
        const res = await api.get('/moods');
        this.history = res.data;
      } catch (err) {
        console.error("Could not fetch history from backend.");
      }
    }
  }
};
</script>

<style scoped>
/* Core Layout */
.container { 
  max-width: 800px; 
  margin: 40px auto; 
  padding: 0 20px;
  font-family: 'Inter', 'Segoe UI', system-ui, sans-serif; 
  color: #1a1a1a; 
  background-color: #f8f9fa;
  min-height: 100vh;
}

/* Typography */
.app-header { text-align: center; margin-bottom: 40px; }
h1 { font-size: 2.5rem; font-weight: 800; letter-spacing: -1px; margin-bottom: 8px; }
.accent { color: #555; font-weight: 300; }
.subtitle { color: #666; font-size: 1.1rem; }

/* Cards */
.card { 
  background: #ffffff; 
  padding: 30px; 
  border-radius: 20px; 
  box-shadow: 0 10px 25px rgba(0,0,0,0.05); 
  margin-bottom: 30px; 
  border: 1px solid #f0f0f0;
}

/* Inputs */
.input-group { margin-bottom: 20px; }
.input-group label { display: block; font-weight: 600; margin-bottom: 8px; font-size: 0.9rem; color: #444; }

.input-field { 
  width: 100%; 
  padding: 14px; 
  border-radius: 12px; 
  border: 2px solid #eee; 
  font-size: 16px; 
  background: #fdfdfd; 
  color: #1a1a1a; 
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-field:focus {
  outline: none;
  border-color: #000;
  background: #fff;
  box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
}

textarea.input-field { min-height: 120px; resize: vertical; }

/* Buttons */
.btn { 
  padding: 14px 28px; 
  border-radius: 12px; 
  border: none; 
  cursor: pointer; 
  font-weight: 700; 
  font-size: 1rem;
  transition: all 0.2s active; 
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.submit-btn { 
  background-color: #000; 
  color: #fff; 
  width: 100%;
}

.submit-btn:hover:not(:disabled) { background-color: #222; transform: translateY(-1px); }
.submit-btn:active { transform: translateY(0); }

.refresh-btn { 
  background: #f0f0f0; 
  color: #000; 
  font-size: 0.85rem; 
  padding: 8px 16px;
}

.refresh-btn:hover { background: #e5e5e5; }

.btn:disabled { opacity: 0.4; cursor: not-allowed; }

/* AI Response Box */
.ai-box { 
  background: #000; 
  padding: 24px; 
  margin-top: 25px; 
  border-radius: 16px; 
  color: #fff; 
  position: relative;
  line-height: 1.6;
}

.ai-badge {
  position: absolute;
  top: -10px;
  left: 20px;
  background: #fff;
  color: #000;
  font-size: 0.7rem;
  font-weight: 900;
  padding: 4px 12px;
  border-radius: 20px;
  border: 2px solid #000;
}

/* History Table */
.history-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.history-header h3 { font-size: 1.4rem; margin: 0; }

.table-container { overflow-x: auto; border-radius: 12px; border: 1px solid #eee; }
.history-table { width: 100%; border-collapse: collapse; background: white; }
.history-table th { background-color: #fafafa; padding: 15px; text-align: left; font-size: 0.85rem; text-transform: uppercase; color: #888; border-bottom: 2px solid #eee; }
.history-table td { padding: 15px; border-bottom: 1px solid #f5f5f5; font-size: 0.95rem; }

.font-bold { font-weight: 600; }
.mood-text-cell { color: #555; }
.ai-text-cell { color: #000; font-style: italic; }

.error-msg { color: #d32f2f; background: #ffebee; padding: 10px; border-radius: 8px; margin-top: 15px; font-weight: 500; text-align: center; }

.empty-state { padding: 40px; text-align: center; color: #aaa; }

/* Animations */
.fade-enter-active, .fade-leave-active { transition: opacity 0.5s; }
.fade-enter, .fade-leave-to { opacity: 0; }

@media (max-width: 600px) {
  .container { margin: 20px auto; }
  h1 { font-size: 1.8rem; }
}
</style>