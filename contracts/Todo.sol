// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Todo {

    struct Task {
        string text;
        bool completed;
        bool deleted;
    }

    Task[] public tasks;

    event TaskCreated(uint id, string text);
    event TaskCompleted(uint id, bool completed);
    event TaskDeleted(uint id);

    function addTask(string memory _text) public {
        tasks.push(Task(_text, false, false));
        emit TaskCreated(tasks.length - 1, _text);
    }

    function toggleTask(uint _index) public {
        Task storage task = tasks[_index];
        task.completed = !task.completed;
        emit TaskCompleted(_index, task.completed);
    }

    function deleteTask(uint _index) public {
        tasks[_index].deleted = true;
        emit TaskDeleted(_index);
    }

    function editTask(uint _index, string memory _text) public {
        require(!tasks[_index].deleted, "Task is deleted");
        tasks[_index].text = _text;
    }

    function getTasksCount() public view returns (uint) {
        return tasks.length;
    }
}
