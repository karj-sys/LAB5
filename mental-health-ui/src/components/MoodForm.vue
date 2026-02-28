<template>
  <div class="mood-container">
    <h2>Mood Check-in</h2>
    <div class="form-group">
      <input v-model="name" placeholder="Your name" />
      <textarea v-model="mood" placeholder="How are you feeling today?"></textarea>
      <button @click="submitMood" :disabled="loading">
        {{ loading ? 'Processing...' : 'Submit' }}
      </button>
    </div>


    <div class="output-section" v-if="history.length > 0">
      <table class="db-table">
        <thead>
          <tr>
            <th>full_name</th>
            <th>mood_text</th>
            <th>ai_message</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(entry, index) in history" :key="index">
            <td>{{ entry.full_name }}</td>
            <td>{{ entry.mood_text }}</td>
            <td>{{ entry.ai_message }}</td>
          </tr>
        </tbody>
      </table>
      <p class="stats">{{ history.length }} row(s) in set</p>
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
      history: [] // Holds the joined data from users, mood_entries, and ai_responses
    };
  },
  mounted() {
    // Automatically load data when the page opens
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
        
        // Refresh the table to show the new data immediately
        await this.fetchHistory();
        
        // Optional: clear inputs
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
.mood-container { max-width: 800px; margin: auto; font-family: sans-serif; }
.form-group { display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; }
input, textarea { padding: 10px; border: 1px solid #ccc; border-radius: 4px; }
button { padding: 10px; background-color: #42b983; color: white; border: none; cursor: pointer; }
button:disabled { background-color: #ccc; }

.latest-response { padding: 15px; background: #e3f2fd; border-radius: 5px; }

/* Terminal-style Table */
.output-section { margin-top: 40px; font-family: 'Courier New', Courier, monospace; }
.db-table { width: 100%; border-collapse: collapse; border: 1px solid #444; background: #1e1e1e; color: #d4d4d4; }
.db-table th, .db-table td { border: 1px solid #444; padding: 10px; text-align: left; }
.db-table th { background: #333; color: #fff; }
.stats { font-size: 12px; color: #888; }
</style>