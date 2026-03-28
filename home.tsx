import type { PasswordRecord } from '../types'
import React, { useMemo } from 'react'
import { CATEGORY_COLORS, Icons } from '../constants'
import { Category } from '../types'

interface HomeProps {
  records: PasswordRecord[]
  onSelect: (id: string) => void
}

const Home: React.FC<HomeProps> = ({ records, onSelect }) => {
  const favorites = useMemo(() => records.filter(r => r.isFavorite), [records])
  const categories = Object.values(Category)

  const stats = useMemo(() => {
    return {
      total: records.length,
      weak: records.filter(r => r.strength < 40).length,
      recent: records.sort((a, b) => b.lastUsed - a.lastUsed).slice(0, 3),
    }
  }, [records])

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 p-6 duration-500 space-y-8">
      {/* Search Bar Placeholder */}
      <div className="relative">
        <Icons.Search className="absolute left-4 top-1/2 text-slate-500 -translate-y-1/2" size={18} />
        <input
          type="text"
          placeholder="搜索密码库..."
          className="w-full border border-slate-800 rounded-2xl bg-slate-900 py-3 pl-12 pr-4 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-3xl from-blue-600 to-blue-700 bg-gradient-to-br p-4 shadow-blue-500/10 shadow-lg">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-xl bg-white/10 p-2">
              <Icons.ShieldCheck className="text-white" size={18} />
            </div>
          </div>
          <div className="text-2xl text-white font-bold">{stats.total}</div>
          <div className="text-xs text-blue-100/70 font-medium">记录总数</div>
        </div>
        <div className="border border-slate-800 rounded-3xl bg-slate-900 p-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="rounded-xl bg-red-500/10 p-2">
              <Icons.AlertTriangle className="text-red-400" size={18} />
            </div>
            <span className="text-[10px] text-red-400 font-bold tracking-tighter uppercase">存在风险</span>
          </div>
          <div className="text-2xl text-white font-bold">{stats.weak}</div>
          <div className="text-xs text-slate-400 font-medium">弱密码数量</div>
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-sm text-slate-400 font-bold tracking-widest uppercase">
              <Icons.Star size={14} className="fill-amber-400 text-amber-400" />
              快捷访问
            </h2>
          </div>
          <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
            {favorites.map(record => (
              <button
                key={record.id}
                onClick={() => onSelect(record.id)}
                className="w-32 flex flex-shrink-0 flex-col items-center gap-2 border border-slate-800 rounded-3xl bg-slate-900 p-4 text-center transition-colors hover:bg-slate-800"
              >
                <div className={`${CATEGORY_COLORS[record.category]} h-12 w-12 flex items-center justify-center rounded-2xl text-xl text-white font-bold shadow-lg`}>
                  {record.title[0]}
                </div>
                <div className="w-full">
                  <div className="truncate text-sm font-bold">{record.title}</div>
                  <div className="truncate text-[10px] text-slate-500">{record.username}</div>
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Categories Grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm text-slate-400 font-bold tracking-widest uppercase">分类浏览</h2>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {categories.map(cat => (
            <div
              key={cat}
              className="group flex flex-col cursor-pointer items-center gap-2 border border-slate-800 rounded-2xl bg-slate-900 p-3 text-center transition-all hover:border-blue-500/50"
            >
              <div className={`${CATEGORY_COLORS[cat]} h-10 w-10 flex items-center justify-center rounded-xl text-white/90 transition-transform group-hover:scale-110`}>
                {cat === Category.SOCIAL && <Icons.Home size={20} />}
                {cat === Category.FINANCE && <Icons.Star size={20} />}
                {cat !== Category.SOCIAL && cat !== Category.FINANCE && <Icons.List size={20} />}
              </div>
              <span className="text-[10px] text-slate-400 font-bold tracking-tighter uppercase">{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Recently Used */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm text-slate-400 font-bold tracking-widest uppercase">最近使用</h2>
        </div>
        <div className="space-y-3">
          {stats.recent.map(record => (
            <div
              key={record.id}
              onClick={() => onSelect(record.id)}
              className="flex cursor-pointer items-center gap-4 border border-slate-800 rounded-2xl bg-slate-900 p-4 transition-colors hover:bg-slate-800"
            >
              <div className={`${CATEGORY_COLORS[record.category]} h-10 w-10 flex items-center justify-center rounded-xl text-white font-bold`}>
                {record.title[0]}
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold">{record.title}</div>
                <div className="text-xs text-slate-500">{record.username}</div>
              </div>
              <Icons.ChevronRight className="text-slate-600" size={16} />
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Home
