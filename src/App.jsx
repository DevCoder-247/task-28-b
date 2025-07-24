import { useEffect, useState } from "react";
import { Trash2, Plus, CheckCircle2, Clock, PlayCircle, Sparkles } from "lucide-react";
import axios from "axios";

const Card = ({ children, className = "" }) => (
  <div className={`backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-white/15 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`${className}`}>{children}</div>
);

const Input = ({ className = "", ...props }) => (
  <input
    {...props}
    className={`p-4 rounded-xl border border-white/30 bg-white/10 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent w-full text-white placeholder-white/70 transition-all duration-300 hover:bg-white/15 ${className}`}
  />
);

const BASEURL = import.meta.env.BASE_URL;

const Button = ({ children, className = '', variant = 'primary', ...props }) => {
  const variants = {
    primary: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-purple-500/25",
    danger: "bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-red-500/25",
    success: "bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg hover:shadow-green-500/25"
  };
  
  return (
    <button
      {...props}
      className={`${variants[variant]} text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 hover:shadow-xl active:scale-95 ${className}`}
    >
      {children}
    </button>
  );
};


export default function App() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const fetchTodos = async () => {
    const res = await axios.get(BASEURL);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!title.trim()) return;
    
    setIsAdding(true);
    try {
      await axios.post(BASEURL, { title });
      setTitle("");
      fetchTodos();
    } finally {
      setIsAdding(false);
    }
  };

 

  const deleteTodo = async (id) => {
    const todoElement = document.querySelector(`[data-todo-id="${id}"]`);
    if (todoElement) {
      todoElement.style.transform = 'translateX(100%)';
      todoElement.style.opacity = '0';
      todoElement.style.transition = 'all 0.3s ease-out';
    }
    
    setTimeout(async () => {
      await axios.delete(BASEURL + "/" + `${id}`);
      fetchTodos();
    }, 300);
  };

  const updateStatus = async (id, status) => {
    await axios.put(BASEURL + "/" + `${id}`, { status });
    fetchTodos();
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={20} className="text-green-400" />;
      case 'in-progress':
        return <PlayCircle size={20} className="text-blue-400" />;
      default:
        return <Clock size={20} className="text-yellow-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'from-green-500/20 to-emerald-500/20 border-green-400/30';
      case 'in-progress':
        return 'from-blue-500/20 to-cyan-500/20 border-blue-400/30';
      default:
        return 'from-yellow-500/20 to-orange-500/20 border-yellow-400/30';
    }
  };

  useEffect(() => {
    const timeout = setTimeout(()=> {
      alert("It might take some time please wait after adding your todo");
    }, 3000);
    fetchTodos().finally(() => {
      clearTimeout(timeout);
    });
  }, []);

  const completedCount = todos.filter(t => t.status === 'completed').length;
  const totalCount = todos.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/30 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 p-6 text-white">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Sparkles className="text-purple-400 animate-pulse" size={32} />
              <h1 className="text-6xl font-extrabold bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent">
                Todo Manager v1
              </h1>
              <Sparkles className="text-pink-400 animate-pulse delay-500" size={32} />
            </div>
            
            <div className="flex justify-center gap-6">
              <Card className="px-6 py-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-300">{totalCount}</div>
                  <div className="text-sm text-white/70">Total Tasks</div>
                </div>
              </Card>
              <Card className="px-6 py-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-300">{completedCount}</div>
                  <div className="text-sm text-white/70">Completed</div>
                </div>
              </Card>
              <Card className="px-6 py-3">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-300">{totalCount - completedCount}</div>
                  <div className="text-sm text-white/70">Remaining</div>
                </div>
              </Card>
            </div>
          </div>

          <Card className="transform hover:scale-[1.02] transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Input
                  placeholder="What needs to be done? "
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addTodo()}
                  className="text-lg"
                />
                <Button 
                  onClick={addTodo} 
                  className={`whitespace-nowrap min-w-[120px] ${isAdding ? 'animate-pulse' : ''}`}
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Adding...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus size={20} />
                      Add Task
                    </div>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {totalCount > 0 && (
            <Card className="overflow-hidden">
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Progress</span>
                  <span className="text-sm text-white/70">{Math.round((completedCount / totalCount) * 100)}%</span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-green-500/50"
                    style={{ width: `${(completedCount / totalCount) * 100}%` }}
                  ></div>
                </div>
              </CardContent>
            </Card>
          )}

          {todos.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={48} className="text-purple-400" />
                  </div>
                  <p className="text-xl text-white/80">You have no todos yet.</p>
                  <p className="text-white/60">Add your first task to get started</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {todos.map((todo, index) => (
                <Card 
                  key={todo._id} 
                  data-todo-id={todo._id}
                  className={`transform hover:scale-[1.02] transition-all duration-300 bg-gradient-to-r ${getStatusColor(todo.status)} animate-fadeIn`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="p-6 flex flex-col lg:flex-row justify-between lg:items-center gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      {getStatusIcon(todo.status)}
                      <span className={`font-medium text-lg flex-1 ${todo.status === 'completed' ? 'line-through text-white/70' : 'text-white'} transition-all duration-300`}>
                        {todo.title}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <select
                        value={todo.status}
                        onChange={(e) => updateStatus(todo._id, e.target.value)}
                        className="p-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-300 hover:bg-white/15"
                      >
                        <option value="pending" className="bg-gray-800">Pending</option>
                        <option value="in-progress" className="bg-gray-800">In Progress</option>
                        <option value="completed" className="bg-gray-800">Completed</option>
                      </select>
                      
                      <Button
                        onClick={() => deleteTodo(todo._id)}
                        variant="danger"
                        className="p-3 hover:rotate-12 transition-all duration-300"
                      >
                        <Trash2 size={18} />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }
      `}</style>
    </div>
  );
}