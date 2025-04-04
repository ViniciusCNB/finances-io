"use client";

import React from "react";
import Link from "next/link";
import { FiShoppingBag, FiDollarSign, FiBarChart2, FiHome } from "react-icons/fi";

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-[#1f3494] to-[#25388e]">
      <nav className="flex-1 overflow-y-auto p-4">
        <h1 className="text-2xl font-bold text-white">Finances.io</h1>
        <hr className="my-4 border-t border-gray-200" />
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="flex items-center p-3 text-white rounded-lg bg-slate-200/50 hover:bg-slate-200/30 transition font-medium"
            >
              <FiHome className="w-5 h-5 mr-3 text-white" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/receitas"
              className="flex items-center p-3 text-white rounded-lg bg-slate-200/50 hover:bg-slate-200/30 transition font-medium"
            >
              <FiDollarSign className="w-5 h-5 mr-3 text-white" />
              <span>Receitas</span>
            </Link>
          </li>
          <li>
            <Link
              href="/despesas"
              className="flex items-center p-3 text-white rounded-lg bg-slate-200/50 hover:bg-slate-200/30 transition font-medium"
            >
              <FiShoppingBag className="w-5 h-5 mr-3 text-white" />
              <span>Despesas</span>
            </Link>
          </li>
          <li>
            <Link
              href="/investimentos"
              className="flex items-center p-3 text-white rounded-lg bg-slate-200/50 hover:bg-slate-200/30 transition font-medium"
            >
              <FiBarChart2 className="w-5 h-5 mr-3 text-white" />
              <span>Investimentos</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;