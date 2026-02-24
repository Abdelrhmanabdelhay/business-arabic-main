"use client";

import React from "react";
import { useUserStore } from "@/lib/stores/useUserStore";
import { Chip } from "@nextui-org/chip";
import {
  FiMail,
  FiShield,
} from "react-icons/fi";

function ProfileComponent() {
  const { user } = useUserStore();

  if (!user) {
    return (
      <div className="text-center py-20 text-gray-600">
        لا يوجد بيانات مستخدم حالياً.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white border border-gray-200 rounded-3xl px-8 py-10 space-y-10">
          {/* Avatar + Name */}
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <img
              src={user.avatar || "/default-avatar.png"}
              alt={user.fullName}
              className="w-24 h-24 rounded-full object-cover border border-gray-300"
            />
            <div className="text-center sm:text-left">
              <h2 className="text-2xl font-semibold text-gray-900">{user.fullName}</h2>
              <p className="text-gray-500">{user.role}</p>
            </div>
          </div>

          {/* User Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <FiMail className="text-gray-400 mt-1" />
              <div>
                <p className="text-gray-500 mb-1">البريد الإلكتروني</p>
                <p className="font-medium text-gray-800">{user.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <FiShield className="text-gray-400 mt-1" />
              <div>
                <p className="text-gray-500 mb-1">الدور</p>
                <Chip variant="flat" color="primary" size="sm" className="bg-primary-50 text-primary-700">
                  {user.role}
                </Chip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileComponent;
