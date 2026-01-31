// SAFETY CHECK
if (typeof ethers === "undefined") {
  alert("ethers.js not loaded");
  throw new Error("ethers not loaded");
}

const CONTRACT_ADDRESS = "0xAad0045F2b6d317029dF2877B6852Bfcce9Ac078";

const ABI = [
  "function addTask(string)",
  "function toggleTask(uint256)",
  "function deleteTask(uint256)",
  "function editTask(uint256, string)",
  "function tasks(uint256) view returns (string, bool, bool)",
  "function getTasksCount() view returns (uint256)",
  "function getTasks() view returns (tuple(string text, bool completed, bool deleted)[])"
];

let provider;
let signer;
let contract;
let readContract;
let currentFilter = 'all';

// Icons
const TRASH_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>`;
const CHECK_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
const EDIT_ICON = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>`;

async function init() {
  const walletStatus = document.getElementById("walletStatus");

  if (!window.ethereum) {
    walletStatus.innerText = "Need MetaMask";
    walletStatus.style.background = "#fee2e2";
    walletStatus.style.color = "#ef4444";
    alert("MetaMask not detected");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // Reliable RPC for reading data
    const readProvider = new ethers.providers.JsonRpcProvider("https://eth-sepolia.g.alchemy.com/v2/DbzvUKLIw7Q48wfOhSuoo");
    readContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, readProvider);

    // Wallet provider for signing transactions
    provider = new ethers.providers.Web3Provider(window.ethereum);

    // Check if connected to Sepolia
    const { chainId } = await provider.getNetwork();
    if (chainId !== 11155111) {
      alert("Please connect your wallet to the Sepolia testnet");
    }

    signer = provider.getSigner();

    // Contract instance for WRITING (uses signer)
    contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    const address = await signer.getAddress();
    walletStatus.innerText = "Connected: " + address.substring(0, 6) + "..." + address.substring(38);
    walletStatus.style.background = "#dbeafe";
    walletStatus.style.color = "#2563eb";

    // Event Listeners
    document.getElementById("addBtn").onclick = addTask;
    document.getElementById("taskInput").onkeypress = (e) => {
      if (e.key === 'Enter') addTask();
    };

    // Filters
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.onclick = () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        loadTasks();
      }
    });

    loadTasks();
  } catch (err) {
    console.error("Wallet connection failed:", err);
    walletStatus.innerText = "Error Connecting";
    walletStatus.style.background = "#fee2e2";
    walletStatus.style.color = "#ef4444";
  }
}

async function loadTasks() {
  const list = document.getElementById("taskList");
  const loading = document.getElementById("loading");

  // Show loading only if list is empty (first load)
  if (list.children.length === 0) {
    loading.style.display = "block";
  }

  try {
    // NEW WAY: Get all tasks in ONE call using reliable Read Provider
    const tasksRaw = await readContract.getTasks();

    const tasks = tasksRaw.map((t, i) => ({
      id: i,
      text: t.text,
      completed: t.completed,
      deleted: t.deleted
    }));

    renderTasks(tasks, list);

  } catch (err) {
    console.error("Error loading tasks", err);
    // Silent fail or show toast?
  } finally {
    loading.style.display = "none";
  }
}

function renderTasks(tasks, listElement) {
  listElement.innerHTML = "";

  const validTasks = tasks.filter(t => !t.deleted);
  const filteredTasks = validTasks.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    listElement.innerHTML = `<div class="empty-state">No ${currentFilter === 'all' ? '' : currentFilter} tasks found</div>`;
    return;
  }

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? 'completed' : ''}`;
    li.id = `task-item-${task.id}`;

    li.innerHTML = `
            <div class="task-checkbox" onclick="toggleTask(${task.id})">
                ${task.completed ? CHECK_ICON : ''}
            </div>
            <div class="task-content" id="content-${task.id}">${escapeHtml(task.text)}</div>
            <div class="task-actions">
                ${!task.completed ? `
                <button class="icon-btn edit" onclick="enableEdit(${task.id}, '${escapeHtml(task.text).replace(/'/g, "\\'")}')">
                    ${EDIT_ICON}
                </button>` : ''}
                <button class="icon-btn delete" onclick="deleteTask(${task.id})">
                    ${TRASH_ICON}
                </button>
            </div>
        `;

    listElement.appendChild(li);
  });
}

async function addTask() {
  const input = document.getElementById("taskInput");
  const btn = document.getElementById("addBtn");

  if (!input.value.trim()) return;

  const originalText = btn.innerText;
  btn.innerText = "Adding...";
  btn.disabled = true;

  try {
    const tx = await contract.addTask(input.value);
    await tx.wait(); // Wait for confirmation
    input.value = "";
    loadTasks();
  } catch (err) {
    console.error(err);
    // Extract meaningful error message
    let errorMessage = "Error adding task";
    if (err.reason) errorMessage += ": " + err.reason;
    else if (err.message) errorMessage += ": " + err.message;

    alert(errorMessage);
  } finally {
    btn.innerText = originalText;
    btn.disabled = false;
  }
}

async function toggleTask(id) {
  try {
    const tx = await contract.toggleTask(id);
    await tx.wait();
    loadTasks();
  } catch (err) {
    console.error(err);
    alert("Error updating task");
  }
}

window.deleteTask = async function (id) {
  if (!confirm("Are you sure you want to delete this task?")) return;

  try {
    const tx = await contract.deleteTask(id);
    await tx.wait();
    loadTasks();
  } catch (err) {
    console.error(err);
    alert("Error deleting task");
  }
}

window.enableEdit = function (id, text) {
  const li = document.getElementById(`task-item-${id}`);
  const contentDiv = document.getElementById(`content-${id}`);
  const actionsDiv = li.querySelector('.task-actions');

  // Hide default actions
  actionsDiv.style.display = 'none';

  // Replace text with input + buttons
  contentDiv.innerHTML = `
        <input type="text" class="edit-input" id="edit-input-${id}" value="${text}" />
        <div style="display:flex; gap: 4px; margin-left:8px;">
            <button class="save-btn" onclick="saveEdit(${id})">Save</button>
            <button class="icon-btn" onclick="cancelEdit(${id}, '${text.replace(/'/g, "\\'")}')">✕</button>
        </div>
    `;

  const input = document.getElementById(`edit-input-${id}`);
  input.focus();
  input.onkeypress = (e) => {
    if (e.key === 'Enter') saveEdit(id);
  };

  // Disable checkbox click
  li.querySelector('.task-checkbox').onclick = null;
}

window.saveEdit = async function (id) {
  const input = document.getElementById(`edit-input-${id}`);
  const newText = input.value.trim();
  if (!newText) return;

  try {
    // Optimistic UI update (optional, but let's stick to simple wait for now)
    input.disabled = true;
    const tx = await contract.editTask(id, newText);
    await tx.wait();
    loadTasks();
  } catch (err) {
    console.error(err);
    alert("Error saving edit");
    // Reload to reset
    loadTasks();
  }
}

window.cancelEdit = function (id, originalText) {
  // Just reload the list to reset state (simplest way to restore listeners etc)
  loadTasks();
}


function escapeHtml(text) {
  const div = document.createElement('div');
  div.innerText = text;
  return div.innerHTML;
}

window.onload = init;
