import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Book, 
  Clock, 
  Users, 
  Settings, 
  RefreshCw, 
  Save, 
  Trash2, 
  Eye, 
  EyeOff, 
  Key,
  User,
  Cpu,
  Network,
  Database
} from 'lucide-react';
import bg from "../assets/bg-gradient.png";
import CommonHeader from '../components/CommonHeader';
import SideNav from '../components/SideNav';
import { supabase } from '../connect-supabase.js';

const SmartIOTPage = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('auto-logging');
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [settings, setSettings] = useState({
    autoLogging: true,
    logRetentionDays: 30,
    enableNotifications: true,
    maxBorrowDuration: 7,
    iotDeviceStatus: 'online',
    autoSync: true,
    realTimeUpdates: true
  });
  const [adminAccounts, setAdminAccounts] = useState([]);
  const [newAdmin, setNewAdmin] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'admin'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState(null);

  useEffect(() => {
    fetchCurrentAdmin();
    fetchLogs();
    fetchAdminAccounts();
    fetchSettings();
  }, []);

  const fetchCurrentAdmin = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setCurrentAdmin(userData);
    }
  };

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('iot_bookshelf_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAdminAccounts = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'admin')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAdminAccounts(data || []);
    } catch (error) {
      console.error('Error fetching admin accounts:', error);
    }
  };

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('system_settings')
        .select('*')
        .eq('setting_type', 'iot_bookshelf')
        .single();

      if (data && data.settings) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('system_settings')
        .upsert({
          setting_type: 'iot_bookshelf',
          settings: settings,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      alert('Settings saved successfully!');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings');
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdmin = async () => {
    try {
      if (!newAdmin.full_name || !newAdmin.email || !newAdmin.password) {
        alert('Please fill all fields');
        return;
      }

      setLoading(true);

      // Create user in auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newAdmin.email,
        password: newAdmin.password,
      });

      if (authError) throw authError;

      // Create user record in users table
      const { error: userError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          full_name: newAdmin.full_name,
          email: newAdmin.email,
          role: 'admin',
          is_active: true
        });

      if (userError) throw userError;

      setNewAdmin({
        full_name: '',
        email: '',
        password: '',
        role: 'admin'
      });
      
      fetchAdminAccounts();
      alert('Admin account created successfully!');

    } catch (error) {
      console.error('Error creating admin account:', error);
      alert('Error creating admin account');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    if (!confirm('Are you sure you want to delete this admin account?')) return;

    try {
      const { error } = await supabase
        .from('users')
        .update({ is_active: false })
        .eq('id', adminId);

      if (error) throw error;
      
      fetchAdminAccounts();
      alert('Admin account deactivated successfully!');
    } catch (error) {
      console.error('Error deleting admin account:', error);
      alert('Error deleting admin account');
    }
  };

  const clearLogs = async () => {
    if (!confirm('Are you sure you want to clear all logs? This action cannot be undone.')) return;

    try {
      const { error } = await supabase
        .from('iot_bookshelf_logs')
        .delete()
        .lt('created_at', new Date(Date.now() - settings.logRetentionDays * 24 * 60 * 60 * 1000).toISOString());

      if (error) throw error;
      
      fetchLogs();
      alert('Old logs cleared successfully!');
    } catch (error) {
      console.error('Error clearing logs:', error);
      alert('Error clearing logs');
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(prev => !prev);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const handleLogOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const simulateIoTActivity = () => {
    // Simulate adding a new log entry
    const newLog = {
      id: Date.now(),
      action: 'scan',
      book_title: 'Sample Thesis Document',
      book_id: 'TH-' + Math.floor(Math.random() * 1000),
      user_name: 'Test User',
      user_id: 'user-' + Math.floor(Math.random() * 100),
      status: 'success',
      created_at: new Date().toISOString()
    };
    
    setLogs(prev => [newLog, ...prev.slice(0, 49)]);
    alert('Simulated IoT activity logged!');
  };

  return (
    <div className="min-h-screen w-screen bg-cover bg-center bg-no-repeat flex flex-col font-sans" style={{ backgroundImage: `url(${bg})` }}>
      
      <CommonHeader 
        isAuthenticated={true} 
        onLogOut={handleLogOut} 
        userRole="admin"
        onMenuToggle={toggleSidebar}
      />

      <div className="flex-1 flex">
        <SideNav isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="flex-1 p-8 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
                <Cpu className="text-white" />
                Smart IoT Bookshelf Management
              </h1>
              <p className="text-white/80">
                Manage auto-logging, system settings, and administrator accounts for the IoT Bookshelf system
              </p>
            </div>

            {/* System Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Device Status</p>
                    <p className={`text-2xl font-bold ${
                      settings.iotDeviceStatus === 'online' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {settings.iotDeviceStatus === 'online' ? 'Online' : 'Offline'}
                    </p>
                  </div>
                  <Network className={`w-8 h-8 ${
                    settings.iotDeviceStatus === 'online' ? 'text-green-500' : 'text-red-500'
                  }`} />
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Total Logs</p>
                    <p className="text-2xl font-bold text-blue-600">{logs.length}</p>
                  </div>
                  <Database className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Active Admins</p>
                    <p className="text-2xl font-bold text-purple-600">
                      {adminAccounts.filter(admin => admin.is_active).length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm">Auto Logging</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {settings.autoLogging ? 'Enabled' : 'Disabled'}
                    </p>
                  </div>
                  <Settings className="w-8 h-8 text-orange-500" />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg">
              {/* Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex -mb-px">
                  {[
                    { id: 'auto-logging', label: 'Auto Logging', icon: Clock },
                    { id: 'account-settings', label: 'Admin Accounts', icon: Users },
                    { id: 'system-settings', label: 'System Settings', icon: Settings }
                  ].map((tab) => {
                    const IconComponent = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 py-4 px-6 border-b-2 font-medium text-sm ${
                          activeTab === tab.id
                            ? 'border-red-500 text-red-600'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <IconComponent size={18} />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div>
                {/* Auto Logging Tab */}
                {activeTab === 'auto-logging' && (
                  <div>
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-2xl font-bold text-gray-800">Auto Logging System</h2>
                      <div className="flex gap-2">
                        <button
                          onClick={simulateIoTActivity}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <RefreshCw size={16} />
                          Simulate Activity
                        </button>
                        <button
                          onClick={fetchLogs}
                          className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <RefreshCw size={16} />
                          Refresh
                        </button>
                        <button
                          onClick={clearLogs}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                          Clear Old Logs
                        </button>
                      </div>
                    </div>

                    {loading ? (
                      <div className="text-center py-8">
                        <RefreshCw className="animate-spin mx-auto mb-2 text-gray-600" />
                        <p className="text-gray-600">Loading logs...</p>
                      </div>
                    ) : (
                      <div className="bg-gray-50 rounded-lg border">
                        <div className="grid grid-cols-12 gap-4 p-4 font-semibold text-sm text-gray-600 border-b">
                          <div className="col-span-2">Timestamp</div>
                          <div className="col-span-2">Action</div>
                          <div className="col-span-3">Book Details</div>
                          <div className="col-span-3">User</div>
                          <div className="col-span-2">Status</div>
                        </div>
                        <div className="max-h-96 overflow-y-auto">
                          {logs.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                              No logs found. Try simulating some activity or check your IoT devices.
                            </div>
                          ) : (
                            logs.map((log, index) => (
                              <div
                                key={log.id}
                                className={`grid grid-cols-12 gap-4 p-4 text-sm border-b ${
                                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                                }`}
                              >
                                <div className="col-span-2">
                                  {new Date(log.created_at).toLocaleString()}
                                </div>
                                <div className="col-span-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    log.action === 'borrow' 
                                      ? 'bg-green-100 text-green-800'
                                      : log.action === 'return'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-gray-100 text-gray-800'
                                  }`}>
                                    {log.action}
                                  </span>
                                </div>
                                <div className="col-span-3">
                                  <div className="font-medium">{log.book_title}</div>
                                  <div className="text-gray-500 text-xs">{log.book_id}</div>
                                </div>
                                <div className="col-span-3">
                                  <div className="font-medium">{log.user_name}</div>
                                  <div className="text-gray-500 text-xs">{log.user_id}</div>
                                </div>
                                <div className="col-span-2">
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    log.status === 'success'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}>
                                    {log.status}
                                  </span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Accounts Tab */}
                {activeTab === 'account-settings' && (
                  <div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Add New Admin Form */}
                      <div className="bg-gray-50 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                          <User size={20} />
                          Add New Admin
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Full Name
                            </label>
                            <input
                              type="text"
                              value={newAdmin.full_name}
                              onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="Enter full name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Email
                            </label>
                            <input
                              type="email"
                              value={newAdmin.email}
                              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              placeholder="Enter email address"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Password
                            </label>
                            <div className="relative">
                              <input
                                type={showPassword ? "text" : "password"}
                                value={newAdmin.password}
                                onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                                placeholder="Enter password"
                              />
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                              >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                              </button>
                            </div>
                          </div>
                          <button
                            onClick={handleAddAdmin}
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                          >
                            <Key size={16} />
                            {loading ? 'Creating...' : 'Create Admin Account'}
                          </button>
                        </div>
                      </div>

                      {/* Existing Admins List */}
                      <div>
                        <h3 className="text-lg font-semibold mb-4">Existing Admin Accounts</h3>
                        <div className="space-y-3">
                          {adminAccounts.map((admin) => (
                            <div
                              key={admin.id}
                              className="bg-white p-4 rounded-lg border flex justify-between items-center"
                            >
                              <div>
                                <div className="font-medium">{admin.full_name}</div>
                                <div className="text-sm text-gray-500">{admin.email}</div>
                                <div className="text-xs text-gray-400">
                                  Created: {new Date(admin.created_at).toLocaleDateString()}
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  admin.is_active 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-red-100 text-red-800'
                                }`}>
                                  {admin.is_active ? 'Active' : 'Inactive'}
                                </span>
                                <button
                                  onClick={() => handleDeleteAdmin(admin.id)}
                                  className="text-red-600 hover:text-red-800 p-1"
                                  title="Delete Admin"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* System Settings Tab */}
                {activeTab === 'system-settings' && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-6">System Configuration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Auto Logging Settings */}
                      <div className="bg-gray-50 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Auto Logging Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Enable Auto Logging
                            </label>
                            <input
                              type="checkbox"
                              checked={settings.autoLogging}
                              onChange={(e) => setSettings({ ...settings, autoLogging: e.target.checked })}
                              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Log Retention (Days)
                            </label>
                            <input
                              type="number"
                              value={settings.logRetentionDays}
                              onChange={(e) => setSettings({ ...settings, logRetentionDays: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              min="1"
                              max="365"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Notification Settings */}
                      <div className="bg-gray-50 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Enable Notifications
                            </label>
                            <input
                              type="checkbox"
                              checked={settings.enableNotifications}
                              onChange={(e) => setSettings({ ...settings, enableNotifications: e.target.checked })}
                              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* IoT Device Settings */}
                      <div className="bg-gray-50 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">IoT Device Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Device Status
                            </label>
                            <select
                              value={settings.iotDeviceStatus}
                              onChange={(e) => setSettings({ ...settings, iotDeviceStatus: e.target.value })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                              <option value="online">Online</option>
                              <option value="offline">Offline</option>
                              <option value="maintenance">Maintenance</option>
                            </select>
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Auto Sync
                            </label>
                            <input
                              type="checkbox"
                              checked={settings.autoSync}
                              onChange={(e) => setSettings({ ...settings, autoSync: e.target.checked })}
                              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Borrowing Settings */}
                      <div className="bg-gray-50 p-6 rounded-lg border">
                        <h3 className="text-lg font-semibold mb-4">Borrowing Settings</h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Maximum Borrow Duration (Days)
                            </label>
                            <input
                              type="number"
                              value={settings.maxBorrowDuration}
                              onChange={(e) => setSettings({ ...settings, maxBorrowDuration: parseInt(e.target.value) })}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                              min="1"
                              max="30"
                            />
                          </div>
                          <div className="flex items-center justify-between">
                            <label className="text-sm font-medium text-gray-700">
                              Real-time Updates
                            </label>
                            <input
                              type="checkbox"
                              checked={settings.realTimeUpdates}
                              onChange={(e) => setSettings({ ...settings, realTimeUpdates: e.target.checked })}
                              className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 flex justify-end">
                      <button
                        onClick={handleSaveSettings}
                        disabled={loading}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-md transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        <Save size={16} />
                        {loading ? 'Saving...' : 'Save Settings'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SmartIOTPage;