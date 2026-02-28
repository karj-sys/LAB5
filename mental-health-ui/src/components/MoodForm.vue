<template>
  <div class="mood-container">
    <div class="card header-card">
      <h2>Mood Check-in</h2>
      <p class="subtitle">How are you feeling today? Let's record your thoughts.</p>
    </div>

    <div class="card form-card">
      <div class="form-group">
        <label>Full Name</label>
        <input v-model="name" placeholder="Enter your name" />
        
        <label>Current Mood</label>
        <textarea v-model="mood" placeholder="Share what's on your mind..."></textarea>
        
        <button @click="submitMood" :disabled="loading" class="submit-btn">
          <span v-if="loading" class="spinner"></span>
          {{ loading ? 'Processing...' : 'Submit Entry' }}
        </button>
      </div>
    </div>

    <div class="output-section" v-if="history.length > 0">
      <div class="table-header">
        <h3>Recent History</h3>
        <span class="stats">{{ history.length }} entry(s) recorded</span>
      </div>
      
      <div class="table-container">
        <table class="db-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mood</th>
              <th>AI Response</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(entry, index) in history" :key="index">
              <td class="name-cell">{{ entry.full_name }}</td>
              <td>{{ entry.mood_text }}</td>
              <td class="ai-cell"><i>"{{ entry.ai_message }}"</i></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
// Logic remains 100% untouched as requested
import api from '../services/api';

export default {
  data() {
    return { 
      name: '', 
      mood: '', 
      aiMessage: '', 
      loading: false,
      history: [] 
    };
  },
  mounted() {
    this.fetchHistory();
  },
  methods: {
    async fetchHistory() {
      try {
        const res = await api.get('/moods');
        this.history = res.data;
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    },
    async submitMood() {
      if (!this.name || !this.mood) return alert("Please fill in both fields");
      
      this.loading = true;
      try {
        const res = await api.post('/moods', {
          full_name: this.name,
          mood_text: this.mood
        });
        this.aiMessage = res.data.ai_message;
        await this.fetchHistory();
        this.mood = '';
      } catch (err) {
        alert("Submit failed. Make sure the server is running on port 3000.");
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
/* Container Layout */
.mood-container { 
  max-width: 900px; 
  margin: 40px auto; 
  padding: 0 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #2c3e50;
  line-height: 1.6;
}

/* Card Styling */
.card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  margin-bottom: 24px;
}

.header-card {
  text-align: center;
  background: linear-gradient(135deg, #42b983 0%, #35495e 100%);
  color: white;
}

.header-card h2 { margin: 0; font-size: 2rem; }
.subtitle { opacity: 0.9; margin-top: 8px; }

/* Form Design */
.form-group { display: flex; flex-direction: column; gap: 15px; }
label { font-weight: 600; font-size: 0.9rem; color: #64748b; margin-bottom: -10px; }

input, textarea { 
  padding: 12px 16px; 
  border: 2px solid #e2e8f0; 
  border-radius: 8px; 
  font-size: 1rem;
  transition: border-color 0.2s;
}

input:focus, textarea:focus {
  outline: none;
  border-color: #42b983;
}

textarea { min-height: 120px; resize: vertical; }

/* Button & Spinner */
.submit-btn { 
  padding: 14px; 
  background-color: #42b983; 
  color: white; 
  border: none; 
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer; 
  transition: transform 0.1s, background 0.2s;
}

.submit-btn:hover { background-color: #3aa876; }
.submit-btn:active { transform: scale(0.98); }
.submit-btn:disabled { background-color: #cbd5e1; cursor: not-allowed; }

/* Table Design */
.output-section { margin-top: 40px; }
.table-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.table-container { 
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
}

.db-table { width: 100%; border-collapse: collapse; background: white; }
.db-table th { background: #f8fafc; color: #64748b; font-weight: 600; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.05em; padding: 15px; border-bottom: 2px solid #f1f5f9; }
.db-table td { padding: 15px; border-bottom: 1px solid #f1f5f9; font-size: 0.95rem; }

.name-cell { font-weight: 600; color: #42b983; }
.ai-cell { color: #475569; line-height: 1.4; }
.stats { font-size: 0.85rem; color: #94a3b8; }
</style>