<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

const router = useRouter()
const projects = ref<{ id: number; name: string; web_url: string; provider: string }[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Connect repo modal state
const showModal = ref(false)
const githubRepos = ref<
  { id: number; name: string; full_name: string; html_url: string; private: boolean }[]
>([])
const reposLoading = ref(false)
const reposError = ref<string | null>(null)
const connectingRepoId = ref<number | null>(null)
const connectedRepoIds = ref<Set<number>>(new Set())

const WEBHOOK_URL = `${import.meta.env.VITE_FASTAPI_URL || 'https://5cb3-39-58-252-244.ngrok-free.app'}/webhooks/github`

async function loadProjects() {
  loading.value = true
  try {
    const response = await api.get('/metrics/projects')
    projects.value = response.data
  } catch (err: any) {
    error.value = 'Failed to load projects'
  } finally {
    loading.value = false
  }
}

async function openConnectModal() {
  showModal.value = true
  reposLoading.value = true
  reposError.value = null
  try {
    const [reposRes, connectedRes] = await Promise.all([
      api.get('/auth/github/repos'),
      api.get('/auth/connected-repos'),
    ])
    githubRepos.value = reposRes.data
    // Build a set of already-connected repo IDs
    connectedRepoIds.value = new Set(connectedRes.data.map((r: any) => Number(r.externalRepoId)))
  } catch (err: any) {
    reposError.value = 'Failed to fetch GitHub repositories'
  } finally {
    reposLoading.value = false
  }
}

async function connectRepo(repo: { id: number; name: string; full_name: string }) {
  connectingRepoId.value = repo.id
  try {
    await api.post('/auth/github/connect-repo', {
      repoFullName: repo.full_name,
      webhookUrl: WEBHOOK_URL,
      repoId: repo.id,
    })
    connectedRepoIds.value.add(repo.id)
    // Refresh projects list in background
    await loadProjects()
  } catch (err: any) {
    alert(err.response?.data?.message || 'Failed to connect repository')
  } finally {
    connectingRepoId.value = null
  }
}

function closeModal() {
  showModal.value = false
  githubRepos.value = []
}

function viewDashboard(projectId: number) {
  router.push({ path: '/dashboard', query: { project_id: projectId } })
}

onMounted(loadProjects)
</script>

<template>
  <div class="projects">
    <div class="projects-header">
      <div>
        <h1 class="projects-title">Projects</h1>
        <p class="projects-subtitle">{{ projects.length }} connected repositories</p>
      </div>
      <button class="connect-btn" @click="openConnectModal">
        <i class="pi pi-plus" />
        Connect Repository
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <ProgressSpinner style="width: 32px; height: 32px" />
    </div>

    <Message v-else-if="error" severity="error">{{ error }}</Message>

    <!-- Empty state -->
    <div v-else-if="projects.length === 0" class="empty-state">
      <i class="pi pi-github empty-icon" />
      <p class="empty-title">No repositories connected</p>
      <p class="empty-subtitle">Connect a GitHub repository to start tracking DORA metrics</p>
      <button class="connect-btn" @click="openConnectModal">
        <i class="pi pi-plus" />
        Connect Repository
      </button>
    </div>

    <div v-else class="projects-grid">
      <div v-for="project in projects" :key="project.id" class="project-card">
        <div class="project-card-header">
          <i class="pi pi-github project-icon" />
          <span class="project-name">{{ project.name }}</span>
        </div>
        <a :href="project.web_url" target="_blank" class="project-url">
          {{ project.web_url }}
        </a>
        <Button
          label="View Dashboard"
          icon="pi pi-chart-bar"
          severity="secondary"
          size="small"
          @click="viewDashboard(project.id)"
          class="project-btn"
        />
      </div>
    </div>

    <!-- Connect Repository Modal -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <div class="modal-header">
            <div>
              <h2 class="modal-title">Connect Repository</h2>
              <p class="modal-subtitle">Select a GitHub repository to track</p>
            </div>
            <button class="modal-close" @click="closeModal">
              <i class="pi pi-times" />
            </button>
          </div>

          <div v-if="reposLoading" class="modal-loading">
            <ProgressSpinner style="width: 28px; height: 28px" />
          </div>

          <div v-else-if="reposError" class="modal-error">
            {{ reposError }}
          </div>

          <div v-else class="repo-list">
            <div
              v-for="repo in githubRepos"
              :key="repo.id"
              class="repo-item"
              :class="{ 'repo-item--connected': connectedRepoIds.has(repo.id) }"
            >
              <div class="repo-info">
                <div class="repo-name-row">
                  <i class="pi pi-lock repo-lock" v-if="repo.private" />
                  <i class="pi pi-unlock repo-lock" v-else />
                  <span class="repo-name">{{ repo.full_name }}</span>
                </div>
                <a :href="repo.html_url" target="_blank" class="repo-url">{{ repo.html_url }}</a>
              </div>
              <button
                v-if="connectedRepoIds.has(repo.id)"
                class="repo-btn repo-btn--connected"
                disabled
              >
                <i class="pi pi-check" />
                Connected
              </button>
              <button
                v-else
                class="repo-btn repo-btn--connect"
                :disabled="connectingRepoId === repo.id"
                @click="connectRepo(repo)"
              >
                <i :class="connectingRepoId === repo.id ? 'pi pi-spin pi-spinner' : 'pi pi-plus'" />
                {{ connectingRepoId === repo.id ? 'Connecting...' : 'Connect' }}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<style scoped>
.projects {
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.projects-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.projects-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: -0.02em;
  margin: 0;
}

.projects-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.4);
  margin: 0;
}

.connect-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #ffffff;
  color: #000000;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s;
  white-space: nowrap;
}

.connect-btn:hover {
  opacity: 0.85;
}

.loading-state {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  padding: 5rem 2rem;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  text-align: center;
}

.empty-icon {
  font-size: 2.5rem;
  color: rgba(255, 255, 255, 0.2);
  margin-bottom: 0.5rem;
}

.empty-title {
  font-size: 16px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.empty-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.35);
  margin: 0 0 0.5rem;
}

/* Projects grid */
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.project-card {
  background: #111318;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 8px;
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  transition: border-color 0.2s;
}

.project-card:hover {
  border-color: rgba(255, 255, 255, 0.15);
}

.project-card-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.project-icon {
  font-size: 18px;
  color: rgba(255, 255, 255, 0.6);
}

.project-name {
  font-size: 15px;
  font-weight: 600;
  color: #ffffff;
}

.project-url {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.35);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.project-url:hover {
  color: rgba(255, 255, 255, 0.6);
}

.project-btn {
  align-self: flex-start;
  margin-top: 0.25rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.modal {
  background: #0e1015;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  width: 100%;
  max-width: 560px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.modal-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.modal-subtitle {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.4);
  margin: 4px 0 0;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.4);
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
  transition: color 0.15s;
}

.modal-close:hover {
  color: #ffffff;
}

.modal-loading,
.modal-error {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: rgba(255, 255, 255, 0.4);
  font-size: 13px;
}

/* Repo list */
.repo-list {
  overflow-y: auto;
  flex: 1;
  padding: 0.5rem 0;
}

.repo-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0.875rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  transition: background 0.15s;
}

.repo-item:hover {
  background: rgba(255, 255, 255, 0.03);
}

.repo-item--connected {
  opacity: 0.5;
}

.repo-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.repo-name-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.repo-lock {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.3);
  flex-shrink: 0;
}

.repo-name {
  font-size: 13px;
  font-weight: 600;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.repo-url {
  font-size: 11px;
  color: rgba(255, 255, 255, 0.25);
  text-decoration: none;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.repo-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  flex-shrink: 0;
  transition: opacity 0.15s;
  border: none;
}

.repo-btn--connect {
  background: #ffffff;
  color: #000000;
}

.repo-btn--connect:hover:not(:disabled) {
  opacity: 0.85;
}

.repo-btn--connect:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.repo-btn--connected {
  background: rgba(255, 255, 255, 0.08);
  color: rgba(255, 255, 255, 0.4);
  cursor: not-allowed;
}
</style>
