// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Forum {
    struct Question {
        uint256 id;
        string content;
        address author;
        uint256 timestamp;
    }
    
    // State variables
    mapping(address => uint256) public userQuestionCount;
    mapping(address => uint256[]) public userQuestions; // Maps user address to their question IDs
    Question[] public questions;
    
    // Events
    event QuestionPosted(uint256 indexed questionId, address indexed author, string content);
    
    // Post a question
    function postQuestion(string memory _content) external {
        require(bytes(_content).length > 0, "Question content cannot be empty");
        require(msg.sender != address(0), "Invalid sender address");
        
        uint256 questionId = questions.length;
        questions.push(Question({
            id: questionId,
            content: _content,
            author: msg.sender,
            timestamp: block.timestamp
        }));
        
        // Add question ID to user's question list
        userQuestions[msg.sender].push(questionId);
        userQuestionCount[msg.sender]++;
        
        emit QuestionPosted(questionId, msg.sender, _content);
    }
    
    // Get total number of questions
    function getQuestionCount() external view returns (uint256) {
        return questions.length;
    }
    
    // Get all questions
    function getAllQuestions() external view returns (
        uint256[] memory,
        address[] memory,
        string[] memory,
        uint256[] memory
    ) {
        uint256[] memory ids = new uint256[](questions.length);
        address[] memory authors = new address[](questions.length);
        string[] memory contents = new string[](questions.length);
        uint256[] memory timestamps = new uint256[](questions.length);
        
        for (uint256 i = 0; i < questions.length; i++) {
            ids[i] = questions[i].id;
            authors[i] = questions[i].author;
            contents[i] = questions[i].content;
            timestamps[i] = questions[i].timestamp;
        }
        
        return (ids, authors, contents, timestamps);
    }
    
    // Get a specific question by ID
    function getQuestion(uint256 _id) external view returns (
        string memory,
        address,
        uint256
    ) {
        require(_id < questions.length, "Question does not exist");
        Question memory question = questions[_id];
        return (question.content, question.author, question.timestamp);
    }
    
    // Get questions by current user (for "My Questions" tab)
    function getMyQuestions() external view returns (
        uint256[] memory,
        string[] memory,
        uint256[] memory
    ) {
        uint256[] memory myQuestionIds = userQuestions[msg.sender];
        uint256 count = myQuestionIds.length;
        
        uint256[] memory ids = new uint256[](count);
        string[] memory contents = new string[](count);
        uint256[] memory timestamps = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            Question memory question = questions[myQuestionIds[i]];
            ids[i] = question.id;
            contents[i] = question.content;
            timestamps[i] = question.timestamp;
        }
        
        return (ids, contents, timestamps);
    }
    
    // Get question count for current user
    function getMyQuestionCount() external view returns (uint256) {
        return userQuestionCount[msg.sender];
    }
    
    // Get questions by specific user address
    function getQuestionsByAddress(address _user) external view returns (
        uint256[] memory,
        string[] memory,
        uint256[] memory
    ) {
        uint256[] memory userQuestionIds = userQuestions[_user];
        uint256 count = userQuestionIds.length;
        
        uint256[] memory ids = new uint256[](count);
        string[] memory contents = new string[](count);
        uint256[] memory timestamps = new uint256[](count);
        
        for (uint256 i = 0; i < count; i++) {
            Question memory question = questions[userQuestionIds[i]];
            ids[i] = question.id;
            contents[i] = question.content;
            timestamps[i] = question.timestamp;
        }
        
        return (ids, contents, timestamps);
    }
}