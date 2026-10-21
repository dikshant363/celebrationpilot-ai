'use client';

import React, { useState } from 'react';
import { TaskItem } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckSquare, Square, Plus, Filter, User } from 'lucide-react';
import { useEvent } from '@/lib/context/EventContext';

export function TaskManager({ tasks }: { tasks: TaskItem[] }) {
  const { updateTaskStatus, addTask } = useEvent();
  const [filterPhase, setFilterPhase] = useState<string>('All');
  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Logistics');
  const [newPhase, setNewPhase] = useState<TaskItem['duePhase']>('1 Week Prior');
  const [newPriority, setNewPriority] = useState<TaskItem['priority']>('Medium');
  const [newAssignee, setNewAssignee] = useState('Coordinator');

  const handleToggle = (task: TaskItem) => {
    const nextStatus = task.status === 'Completed' ? 'To Do' : 'Completed';
    updateTaskStatus(task.id, nextStatus);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({
      title: newTitle.trim(),
      category: newCategory,
      duePhase: newPhase,
      status: 'To Do',
      priority: newPriority,
      assignedTo: newAssignee,
    });
    setNewTitle('');
    setIsAdding(false);
  };

  const filteredTasks =
    filterPhase === 'All' ? tasks : tasks.filter((t) => t.duePhase === filterPhase);

  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const progressPercent = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const phases = ['All', '4 Weeks Prior', '2 Weeks Prior', '1 Week Prior', 'Day Of', 'Post-Event'];

  return (
    <Card className="space-y-6 p-6 sm:p-8 bg-white border border-[#e5e5ea] rounded-2xl shadow-xs">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <h3 className="text-xl font-bold tracking-tight text-[#1d1d1f]">Milestone Checklist & Tasks</h3>
          <p className="text-xs text-[#555555] mt-0.5">
            Track critical countdown deliverables across every pre-celebration phase
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-xs text-[#555555] bg-[#f5f5f7] border border-[#e5e5ea] px-3.5 py-1.5 rounded-full">
            <span className="font-bold text-[#0071e3]">{completedCount}</span> of {tasks.length} Done ({progressPercent}%)
          </div>
          <Button size="sm" variant="outline" onClick={() => setIsAdding(!isAdding)}>
            <Plus className="w-3.5 h-3.5 mr-1" />
            Add Task
          </Button>
        </div>
      </div>

      {/* Add Task Box */}
      {isAdding && (
        <form onSubmit={handleCreateTask} className="bg-[#fbfbfd] p-4 sm:p-5 rounded-2xl border border-[#e5e5ea] space-y-3.5 shadow-2xs">
          <div className="text-xs font-semibold text-[#1d1d1f]">New Milestone Task</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Task description..."
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="sm:col-span-2 px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
              required
            />
            <input
              type="text"
              placeholder="Category..."
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
            />
            <input
              type="text"
              placeholder="Assignee lead..."
              value={newAssignee}
              onChange={(e) => setNewAssignee(e.target.value)}
              className="px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0071e3] transition-all"
            />
            <select
              value={newPhase}
              onChange={(e) => setNewPhase(e.target.value as TaskItem['duePhase'])}
              className="px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl"
            >
              <option value="4 Weeks Prior">4 Weeks Prior</option>
              <option value="2 Weeks Prior">2 Weeks Prior</option>
              <option value="1 Week Prior">1 Week Prior</option>
              <option value="Day Of">Day Of</option>
              <option value="Post-Event">Post-Event</option>
            </select>
            <select
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value as TaskItem['priority'])}
              className="px-3.5 py-2 text-xs bg-white border border-[#d2d2d7] rounded-xl"
            >
              <option value="High">High Priority</option>
              <option value="Medium">Medium Priority</option>
              <option value="Low">Low Priority</option>
            </select>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button size="sm" variant="ghost" onClick={() => setIsAdding(false)}>
              Cancel
            </Button>
            <Button size="sm" variant="primary" type="submit">
              Save Task
            </Button>
          </div>
        </form>
      )}

      {/* Phase Filters */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <Filter className="w-3.5 h-3.5 text-[#555555] mr-1 shrink-0" />
        {phases.map((p) => (
          <button
            key={p}
            onClick={() => setFilterPhase(p)}
            aria-pressed={filterPhase === p}
            className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 cursor-pointer ${
              filterPhase === p
                ? 'bg-[#1d1d1f] text-white shadow-2xs'
                : 'bg-[#f5f5f7] text-[#555555] hover:bg-[#e8e8ed]'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-2.5">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#555555] bg-[#fbfbfd] rounded-2xl border border-dashed border-[#e5e5ea]">
            No tasks found in this timeline phase.
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isCompleted = task.status === 'Completed';
            return (
              <div
                key={task.id}
                onClick={() => handleToggle(task)}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl border transition-all cursor-pointer select-none ${
                  isCompleted
                    ? 'bg-[#fbfbfd] border-[#e5e5ea] opacity-75'
                    : 'bg-white border-[#e5e5ea] hover:border-[#d2d2d7] shadow-2xs'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="shrink-0 text-[#0071e3]">
                    {isCompleted ? (
                      <CheckSquare className="w-4 h-4 text-[#34c759]" />
                    ) : (
                      <Square className="w-4 h-4 text-[#86868b]" />
                    )}
                  </div>
                  <div>
                    <span
                      className={`text-xs sm:text-sm font-medium ${
                        isCompleted ? 'line-through text-[#86868b]' : 'text-[#1d1d1f]'
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[11px] text-[#555555]">{task.category}</span>
                      <span className="text-[11px] text-[#86868b]">•</span>
                      <span className="text-[11px] text-[#555555]">{task.duePhase}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Badge
                    variant={
                      task.priority === 'High'
                        ? 'red'
                        : task.priority === 'Medium'
                        ? 'amber'
                        : 'gray'
                    }
                  >
                    {task.priority}
                  </Badge>
                  <div className="hidden sm:flex items-center gap-1 text-[11px] text-[#555555] bg-[#f5f5f7] px-2.5 py-0.5 rounded-full">
                    <User className="w-3 h-3 text-[#555555]" />
                    <span>{task.assignedTo}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
