// Web3 configuration
let web3;
let forumContract;
let userAccount;

// SIMPLIFIED ABI - Use this exact one
const contractABI = [
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_content",
				"type": "string"
			}
		],
		"name": "postQuestion",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "questionId",
				"type": "uint256"
			},
			{
				"indexed": true,
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "content",
				"type": "string"
			}
		],
		"name": "QuestionPosted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "getAllQuestions",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "address[]",
				"name": "",
				"type": "address[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyQuestionCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyQuestions",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_id",
				"type": "uint256"
			}
		],
		"name": "getQuestion",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getQuestionCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_user",
				"type": "address"
			}
		],
		"name": "getQuestionsByAddress",
		"outputs": [
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			},
			{
				"internalType": "string[]",
				"name": "",
				"type": "string[]"
			},
			{
				"internalType": "uint256[]",
				"name": "",
				"type": "uint256[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "questions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "id",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "content",
				"type": "string"
			},
			{
				"internalType": "address",
				"name": "author",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "userQuestionCount",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "userQuestions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];

// REPLACE THIS WITH YOUR ACTUAL CONTRACT ADDRESS FROM REMIX
const contractAddress = "0x5802016Bc9976C6f63D6170157adAeA1924586c1"; 

// Debug function to test connection
async function testConnection() {
    console.log("Testing contract connection...");
    console.log("Contract address:", contractAddress);
    console.log("User account:", userAccount);
    
    try {
        // Test if contract is connected
        const questionCount = await forumContract.methods.getQuestionCount().call();
        console.log("Question count:", questionCount);
        return true;
    } catch (error) {
        console.error("Contract connection test failed:", error);
        return false;
    }
}

// Check ETH balance
async function checkBalance() {
    try {
        const balance = await web3.eth.getBalance(userAccount);
        const balanceInETH = web3.utils.fromWei(balance, 'ether');
        
        document.getElementById('balance').innerHTML = 
            `💰 Balance: ${parseFloat(balanceInETH).toFixed(4)} ETH`;
        
        return parseFloat(balanceInETH);
    } catch (error) {
        console.error('Error checking balance:', error);
        document.getElementById('balance').innerHTML = 'Error checking balance';
        return 0;
    }
}

// Switch to Sepolia network
async function switchToSepolia() {
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0xaa36a7' }] // Sepolia
        });
        return true;
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: '0xaa36a7',
                        chainName: 'Sepolia',
                        rpcUrls: ['https://sepolia.drpc.org'],
                        blockExplorerUrls: ['https://sepolia.etherscan.io'],
                        nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 }
                    }]
                });
                return true;
            } catch (addError) {
                console.error('Failed to add Sepolia:', addError);
                return false;
            }
        }
        return false;
    }
}

// Initialize Web3 and contract
async function initWeb3() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        try {
            // Request account access
            await window.ethereum.request({ method: 'eth_requestAccounts' });
            const accounts = await web3.eth.getAccounts();
            userAccount = accounts[0];
            
            console.log("User account:", userAccount);
            
            // Initialize contract
            forumContract = new web3.eth.Contract(contractABI, contractAddress);
            console.log("Contract initialized:", forumContract);
            
            // Test connection
            const connected = await testConnection();
            if (!connected) {
                document.getElementById('status').innerHTML = 
                    '❌ Contract connection failed. Check address and ABI.';
                return;
            }
            
            // Check balance
            await checkBalance();
            
            document.getElementById('status').innerHTML = 
                `✅ Connected! Account: ${userAccount.substring(0, 8)}...`;
            
        } catch (error) {
            console.error("Connection error:", error);
            document.getElementById('status').innerHTML = 'Connection failed: ' + error.message;
        }
    } else {
        alert('Please install Rabby Wallet or MetaMask!');
    }
}

// Tab functions
function showTab(tabName) {
    // Hide all tabs
    document.getElementById('allTab').style.display = 'none';
    document.getElementById('askTab').style.display = 'none';
    document.getElementById('myTab').style.display = 'none';
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').style.display = 'block';
    
    // Load data when switching to specific tabs
    if (tabName === 'all') {
        loadQuestions();
    } else if (tabName === 'my') {
        loadMyQuestions();
    }
}

// Load all questions with better error handling
async function loadQuestions() {
    try {
        console.log("Loading questions...");
        document.getElementById('questions').innerHTML = 'Loading questions from blockchain...';
        
        // Test if contract is accessible
        const questionCount = await forumContract.methods.getQuestionCount().call();
        console.log("Total questions:", questionCount);
        
        if (questionCount === 0) {
            document.getElementById('questions').innerHTML = 
                '<p>No questions yet. Be the first to ask a question!</p>';
            return;
        }
        
        // Get all questions
        const result = await forumContract.methods.getAllQuestions().call();
        console.log("Questions result:", result);
        
        const [ids, authors, contents, timestamps] = result;
        
        let html = `<h3>All Questions (${ids.length})</h3>`;
        
        for (let i = 0; i < ids.length; i++) {
            const date = new Date(parseInt(timestamps[i]) * 1000);
            html += `
                <div class="question">
                    <strong>Question ${parseInt(ids[i]) + 1}:</strong> ${contents[i]}<br>
                    <small>By: ${authors[i].substring(0, 10)}... | 
                    ${date.toLocaleString()}</small>
                </div>
            `;
        }
        
        document.getElementById('questions').innerHTML = html;
        
    } catch (error) {
        console.error('Error loading questions:', error);
        document.getElementById('questions').innerHTML = 
            `<p>Error loading questions: ${error.message}</p>
             <p>Check browser console (F12) for details</p>`;
    }
}

// Load user's questions
async function loadMyQuestions() {
    try {
        document.getElementById('myQuestions').innerHTML = 'Loading your questions...';
        
        const result = await forumContract.methods.getMyQuestions().call({from: userAccount});
        const [ids, contents, timestamps] = result;
        
        let html = `<h3>Your Questions (${ids.length})</h3>`;
        
        if (ids.length === 0) {
            html += '<p>You haven\'t asked any questions yet.</p>';
        } else {
            for (let i = 0; i < ids.length; i++) {
                const date = new Date(parseInt(timestamps[i]) * 1000);
                html += `
                    <div class="question">
                        <strong>Question ${parseInt(ids[i]) + 1}:</strong> ${contents[i]}<br>
                        <small>Posted: ${date.toLocaleString()}</small>
                    </div>
                `;
            }
        }
        
        document.getElementById('myQuestions').innerHTML = html;
        
    } catch (error) {
        console.error('Error loading my questions:', error);
        document.getElementById('myQuestions').innerHTML = 
            `<p>Error loading your questions: ${error.message}</p>`;
    }
}

// Post a question
async function postQuestion() {
    const content = document.getElementById('questionText').value.trim();
    if (!content) {
        alert('Please enter a question');
        return;
    }
    
    try {
        document.getElementById('status').innerHTML = 'Posting question to blockchain...';
        
        const result = await forumContract.methods.postQuestion(content).send({
            from: userAccount,
            gas: 300000
        });
        
        document.getElementById('status').innerHTML = '✅ Question posted successfully!';
        document.getElementById('questionText').value = '';
        
        // Refresh questions list
        loadQuestions();
        
    } catch (error) {
        console.error('Error posting question:', error);
        document.getElementById('status').innerHTML = '❌ Error: ' + error.message;
    }
}

// Refresh balance
async function refreshBalance() {
    await checkBalance();
}

// Refresh questions
async function refreshQuestions() {
    await loadQuestions();
}

// Initialize when page loads
window.addEventListener('load', function() {
    initWeb3();
    // Show all questions tab by default
    showTab('all');
});