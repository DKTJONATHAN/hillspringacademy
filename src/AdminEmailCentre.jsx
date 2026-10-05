import { useEffect, useMemo, useState } from "react";
import { PageHead } from "./components.jsx";
import { adminCall, adminSignIn, accountApi, appsApi } from "./supabase.js";
import { getAdminToken, setAdminToken, clearAdminToken } from "./session.js";

export function AdminEmailCentre() {
  const [token, setToken] = useState(() => getAdminToken());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [resetMode, setResetMode] = useState(false);
  const [resetStep, setResetStep] = useState("request");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetStatus, setResetStatus] = useState("");
  const [tab, setTab] = useState("applications");
  const [apps, setApps] = useState([]);
  const [appFilter, setAppFilter] = useState("pending");
  const [appStatus, setAppStatus] = useState("");
  const [notes, setNotes] = useState({});
  const [deciding, setDeciding] = useState("");
  const [resetCooldown, setResetCooldown] = useState(0);
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [status, setStatus] = useState("");
  const [reply, setReply] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [compose, setCompose] = useState({ kind: "newsletter", audience: "subscribers", subject: "", content: "", recipients: "" });
  const [admins, setAdmins] = useState([]);
  const [adminForm, setAdminForm] = useState({ name: "", email: "", password: "" });
  const [adminStatus, setAdminStatus] = useState("");
  const [adminBusy, setAdminBusy] = useState(false);

  useEffect(() => {
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement("meta");
      robots.name = "robots";
      document.head.appendChild(robots);
    }
    robots.content = "noindex, nofollow";
    return () => {
      robots.content = "index, follow";
    };
  }, []);

  const loadConversations = async (t = token) => {
    const data = await adminCall(t, { action: "list_conversations" });
    setConversations(data.conversations || []);
  };
  const loadSubscribers = async () => {
    const data = await adminCall(token, { action: "subscribers" });
    setSubscribers(data.subscribers || []);
  };

  const loadAdmins = async (t = token) => {
    const data = await appsApi({ action: "list_admins" }, t);
    setAdmins(data.admins || []);
  };

  const createAdmin = async (e) => {
    e.preventDefault();
    setAdminStatus("");
    setAdminBusy(true);
    try {
      await appsApi(
        {
          action: "create_admin",
          name: adminForm.name.trim(),
          email: adminForm.email.trim(),
          password: adminForm.password,
        },
        token
      );
      setAdminForm({ name: "", email: "", password: "" });
      setAdminStatus("Admin added. They can sign in at /admin with the email and password you set.");
      await loadAdmins();
    } catch (err) {
      setAdminStatus(err.message || "Unable to add admin.");
    } finally {
      setAdminBusy(false);
    }
  };

  const setAdminActive = async (user_id, active) => {
    setAdminStatus("");
    try {
      await appsApi({ action: "set_admin_active", user_id, active }, token);
      await loadAdmins();
      setAdminStatus(active ? "Admin reactivated." : "Admin deactivated.");
    } catch (err) {
      setAdminStatus(err.message || "Unable to update admin.");
    }
  };

  // PLACEHOLDER_REST_OF_FILE
}
