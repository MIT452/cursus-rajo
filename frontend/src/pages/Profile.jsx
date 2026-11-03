import { useState } from "react";
import api from "../services/api";
import { useAuth } from "../hooks/useAuth";
import Card from "../components/Card";
import Input from "../components/Input";
import Button from "../components/Button";
import FadeIn from "../animations/FadeIn";
import { CheckCircle2 } from "lucide-react";

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      await api.put(`/users/${user.id}`, { name });
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="px-6 py-10 sm:px-10">
      <FadeIn>
        <h1 className="font-display text-2xl text-paper-50 sm:text-3xl">Profil</h1>
        <p className="mt-1 text-sm text-paper-400">Gerez vos informations personnelles.</p>
      </FadeIn>

      <FadeIn delay={0.1} className="mt-8 max-w-md">
        <Card hover={false}>
          <div className="mb-6 flex items-center gap-4">
            <div
              className="flex h-14 w-14 items-center justify-center rounded-full text-lg font-medium text-ink-950"
              style={{ backgroundColor: user?.avatarColor }}
            >
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-medium text-paper-50">{user?.name}</p>
              <p className="text-sm text-paper-400">{user?.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Input label="Nom complet" value={name} onChange={(e) => setName(e.target.value)} />
            <Input label="Email" value={user?.email} disabled className="opacity-60" />
            <Button type="submit" loading={saving} className="w-full">
              Enregistrer les modifications
            </Button>
            {saved && (
              <p className="flex items-center gap-2 text-sm text-teal-400">
                <CheckCircle2 size={15} /> Profil mis a jour
              </p>
            )}
          </form>
        </Card>
      </FadeIn>
    </div>
  );
};

export default Profile;
