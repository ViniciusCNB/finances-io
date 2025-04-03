"use client";

import React from "react";
import Link from "next/link";
import { FiShoppingBag, FiDollarSign, FiBarChart2, FiHome } from "react-icons/fi";

const Sidebar: React.FC = () => {
  return (
    <div className="flex flex-col h-full">
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          <li>
            <Link
              href="/"
              className="flex items-center p-3 text-slate-600 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-300 font-medium"
            >
              <FiHome className="w-5 h-5 mr-3 text-slate-600" />
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link
              href="/receitas"
              className="flex items-center p-3 text-slate-600 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-300 font-medium"
            >
              <FiDollarSign className="w-5 h-5 mr-3 text-slate-600" />
              <span>Receitas</span>
            </Link>
          </li>
          <li>
            <Link
              href="/despesas"
              className="flex items-center p-3 text-slate-600 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-300 font-medium"
            >
              <FiShoppingBag className="w-5 h-5 mr-3 text-slate-600" />
              <span>Despesas</span>
            </Link>
          </li>
          <li>
            <Link
              href="/investimentos"
              className="flex items-center p-3 text-slate-600 rounded-lg bg-blue-50 hover:bg-blue-100 transition-all duration-300 font-medium"
            >
              <FiBarChart2 className="w-5 h-5 mr-3 text-slate-600" />
              <span>Investimentos</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;