import re

file_path = "src/pages/project/genapp/index.jsx"
with open(file_path, "r") as f:
    content = f.read()

# I will just write string replacements for each block.
# Since it's easier, I'll provide the exact replacements manually for each block in the text.

replacements = [
    (
"""<<<<<<< HEAD
ame="p-2 rounded-xl bg-gray-200 dark:bg-[#2a2a2c]">
 className="h-6 w-6 text-gray-600 dark:text-gray-300" />
=======
ame="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-white/10 dark:to-white/5">
 className="h-6 w-6 text-blue-600 dark:text-[var(--accent-text)]" />
>>>>>>> refactorFEHV""",
"""ame="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-white/10 dark:to-white/5">
 className="h-6 w-6 text-blue-600 dark:text-[var(--accent-text)]" />"""
    ),
    (
"""<<<<<<< HEAD
 App: bên trái tiêu đề + mô tả, bên phải nút Gen App trên / Model selection dưới */}
ame="rounded-2xl shadow-2xl mb-6" style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)' }}>
tent className="pt-6 pb-6">
=======
 App: chọn deploy_id rồi bấm Gen App */}
ame="gen-app-card rounded-2xl shadow-2xl mb-6 bg-white dark:[background:var(--card-gradient)] border border-gray-200 dark:border-[var(--border)]">
ame="flex items-center gap-2 text-gray-900 dark:text-[var(--text)]">
 className="w-2 h-2 rounded-full bg-gray-500 dark:bg-[var(--secondary-text)]" />
 App
tent>
>>>>>>> refactorFEHV""",
""" App: bên trái tiêu đề + mô tả, bên phải nút Gen App trên / Model selection dưới */}
ame="gen-app-card rounded-2xl shadow-2xl mb-6 bg-white dark:[background:var(--card-gradient)] border border-gray-200 dark:border-[var(--border)]">
tent className="pt-6 pb-6">"""
    ),
    (
"""<<<<<<< HEAD
ame="bg-gray-600 hover:bg-gray-500 text-white"
=======
ame="bg-gray-600 hover:bg-gray-700 dark:bg-[#2a2a2a] dark:hover:bg-[#333333] dark:border dark:border-[var(--border)] text-white"
>>>>>>> refactorFEHV""",
"""ame="bg-gray-600 hover:bg-gray-700 dark:bg-[#2a2a2a] dark:hover:bg-[#333333] dark:border dark:border-[var(--border)] text-white" """
    ),
    (
"""<<<<<<< HEAD
ame="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
 App + mô tả */}
ame="flex-1 min-w-0">
ame="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-white mb-1">
 className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-500" />
 App
ame="text-gray-500 dark:text-gray-400 text-sm">
and click Gen App to create an app from the model.
g hàng thẳng): Model select + nút Gen App */}
ame="flex flex-row items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
ame="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
Change={(val) => {
st id = val ?? null
st found = deploys.find(
=== id
d) {
ame(found.name ?? '')
ame="theme-dropdown h-10 min-w-[200px] sm:min-w-[220px]"
(
 key={d.model_id} value={d.model_id}>
ame ?? `Model #${d.model_id}`} (ID: {d.model_id})
>

Click={() => setIsFormOpen(true)}
ame="h-10 px-6 shrink-0 bg-gray-600 hover:bg-gray-500 text-white disabled:opacity-50"
ame="flex flex-wrap gap-4 items-center justify-between">
ame="text-sm text-gray-500 dark:text-[var(--secondary-text)]">
and click Gen App to create an app from the model.
ame="flex items-center gap-3 shrink-0">
ame="flex items-center gap-2 min-w-[200px]">
ame="text-sm font-medium text-gray-700 dark:text-[var(--text)] whitespace-nowrap">
Change={(val) => {
st found = deploys.find(
=== val
d) {
ame(found.name ?? '')
ame="w-[220px] bg-gray-50 dark:bg-[var(--input-bg)] border-gray-200 dark:border-[var(--input-border)] text-gray-900 dark:text-[var(--text)]"
ew Map(deploys.map((d) => [d.model_id, d])).values()].map((d) => (

ame ?? `Model #${d.model_id}`} (ID: {d.model_id})
>

Click={() => setIsFormOpen(true)}
ame="bg-gray-600 hover:bg-gray-700 dark:bg-[#2a2a2a] dark:hover:bg-[#333333] dark:border dark:border-[var(--border)] text-white disabled:opacity-50"
ame="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
 App + mô tả */}
ame="flex-1 min-w-0">
ame="flex items-center gap-2 text-xl font-semibold text-gray-900 dark:text-[var(--text)] mb-1">
 className="w-2 h-2 rounded-full bg-gray-500 dark:bg-[var(--secondary-text)]" />
 App
ame="text-gray-500 dark:text-[var(--secondary-text)] text-sm">
and click Gen App to create an app from the model.
g hàng thẳng): Model select + nút Gen App */}
ame="flex flex-row items-center gap-3 shrink-0 flex-wrap sm:flex-nowrap">
ame="text-sm font-medium text-gray-700 dark:text-[var(--text)] whitespace-nowrap">
Change={(val) => {
st id = val ?? null
st found = deploys.find(
=== id
d) {
ame(found.name ?? '')
ame="theme-dropdown h-10 min-w-[200px] sm:min-w-[220px]"
ew Map(deploys.map((d) => [d.model_id, d])).values()].map((d) => (
 key={d.model_id} value={d.model_id}>
ame ?? `Model #${d.model_id}`} (ID: {d.model_id})
>

Click={() => setIsFormOpen(true)}
ame="h-10 px-6 shrink-0 bg-gray-600 hover:bg-gray-700 dark:bg-[#2a2a2a] dark:hover:bg-[#333333] dark:border dark:border-[var(--border)] text-white disabled:opacity-50"
 ),
    (
"""<<<<<<< HEAD
ame="rounded-2xl shadow-2xl" style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)' }}>
tent className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-gray-400">
=======
ame="rounded-2xl shadow-2xl bg-white dark:[background:var(--card-gradient)] border border-gray-200 dark:border-[var(--border)]">
tent className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-[var(--secondary-text)]">
>>>>>>> refactorFEHV""",
"""ame="rounded-2xl shadow-2xl bg-white dark:[background:var(--card-gradient)] border border-gray-200 dark:border-[var(--border)]">
tent className="flex flex-col items-center justify-center py-16 text-gray-500 dark:text-[var(--secondary-text)]">"""
    ),
    (
"""<<<<<<< HEAD
ame="rounded-2xl shadow-2xl" style={{ background: 'var(--card-gradient)', border: '1px solid var(--border)' }}>
tent className="flex flex-col items-center justify-center py-16">
ame="p-4 rounded-full mb-4 bg-gray-100 dark:bg-[#2a2a2c]">
 className="h-12 w-12 text-gray-400 dark:text-gray-500" />
=======
ame="rounded-2xl shadow-2xl bg-white dark:[background:var(--card-gradient)] border border-gray-200 dark:border-[var(--border)]">
tent className="flex flex-col items-center justify-center py-16">
ame="p-4 rounded-full mb-4 bg-blue-50 dark:bg-[var(--hover-bg)]">
 className="h-12 w-12 text-gray-400 dark:text-[var(--secondary-text)]" />
>>>>>>> refactorFEHV""",
"""ame="rounded-2xl shadow-2xl bg-white dark:[background:var(--card-gradient)] border border-gray-200 dark:border-[var(--border)]">
tent className="flex flex-col items-center justify-center py-16">
ame="p-4 rounded-full mb-4 bg-blue-50 dark:bg-[var(--hover-bg)]">
 className="h-12 w-12 text-gray-400 dark:text-[var(--secondary-text)]" />"""
    ),
    (
"""<<<<<<< HEAD
ame="block text-sm font-medium mb-1"
'var(--form-label-color)' }}
ame="block text-sm font-medium text-gray-700 dark:text-[var(--text)] mb-1">
>>>>>>> refactorFEHV""",
"""ame="block text-sm font-medium text-gray-700 dark:text-[var(--text)] mb-1">"""
    ),
    (
"""<<<<<<< HEAD
ame="theme-dropdown w-full"
=======
ame="bg-gray-50 dark:bg-[var(--input-bg)] border-gray-200 dark:border-[var(--input-border)] text-gray-900 dark:text-[var(--text)]"
>>>>>>> refactorFEHV""",
"""ame="theme-dropdown w-full bg-gray-50 dark:bg-[var(--input-bg)] border-gray-200 dark:border-[var(--input-border)] text-gray-900 dark:text-[var(--text)]" """
    ),
    (
"""<<<<<<< HEAD
ame="block text-sm font-medium mb-1"
'var(--form-label-color)' }}
ame="block text-sm font-medium text-gray-700 dark:text-[var(--text)] mb-1">
>>>>>>> refactorFEHV""",
"""ame="block text-sm font-medium text-gray-700 dark:text-[var(--text)] mb-1">"""
    ),
    (
"""<<<<<<< HEAD
ame="modal-form-input w-full rounded-xl border px-4 py-3 text-sm focus:outline-none"
dColor: 'var(--input-bg)',
put-border)',
put-color)',
ame="w-full rounded-xl border border-gray-300 dark:border-[var(--input-border)] bg-white dark:bg-[var(--input-bg)] px-4 py-3 text-sm text-gray-900 dark:text-[var(--text)] placeholder-gray-400 dark:placeholder-[var(--placeholder-text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)]"
>>>>>>> refactorFEHV""",
"""ame="modal-form-input w-full rounded-xl border border-gray-300 dark:border-[var(--input-border)] bg-white dark:bg-[var(--input-bg)] px-4 py-3 text-sm text-gray-900 dark:text-[var(--text)] placeholder-gray-400 dark:placeholder-[var(--placeholder-text)] focus:outline-none focus:ring-2 focus:ring-[var(--input-focus-border)]" """
    ),
    (
"""<<<<<<< HEAD
ame="block text-sm font-medium mb-1"
'var(--form-label-color)' }}
ame="block text-sm font-medium text-gray-700 dark:text-[var(--text)] mb-1">
>>>>>>> refactorFEHV""",
"""ame="block text-sm font-medium text-gray-700 dark:text-[var(--text)] mb-1">"""
    ),
    (
"""<<<<<<< HEAD
ame="w-full rounded-xl border px-3 py-3 text-sm cursor-not-allowed"
dColor: 'var(--input-disabled-bg)',
put-border)',
put-disabled-color)',
ame="mt-1 text-xs"
'var(--secondary-text)' }}
ame="w-full rounded-2xl border border-gray-300 dark:border-[var(--input-border)] bg-gray-100 dark:bg-[var(--input-disabled-bg)] px-3 py-3 text-sm text-gray-500 dark:text-[var(--secondary-text)] cursor-not-allowed"
ame="mt-1 text-xs text-gray-400 dark:text-[var(--secondary-text)]">
>>>>>>> refactorFEHV""",
"""ame="w-full rounded-2xl border border-gray-300 dark:border-[var(--input-border)] bg-gray-100 dark:bg-[var(--input-disabled-bg)] px-3 py-3 text-sm text-gray-500 dark:text-[var(--secondary-text)] cursor-not-allowed"
ame="mt-1 text-xs text-gray-400 dark:text-[var(--secondary-text)]">"""
    ),
    (
"""<<<<<<< HEAD
ame="theme-modal-btn-outline"
=======
ame="border-gray-300 dark:border-[var(--border)] text-gray-700 dark:text-[var(--text)]"
>>>>>>> refactorFEHV""",
"""ame="border-gray-300 dark:border-[var(--border)] text-gray-700 dark:text-[var(--text)]" """
    ),
    (
"""<<<<<<< HEAD
ame="theme-modal-btn-primary"
=======
ame="bg-gray-600 hover:bg-gray-700 dark:bg-[#2a2a2a] dark:hover:bg-[#333333] dark:border dark:border-[var(--border)] text-white disabled:opacity-50"
>>>>>>> refactorFEHV""",
"""ame="bg-gray-600 hover:bg-gray-700 dark:bg-[#2a2a2a] dark:hover:bg-[#333333] dark:border dark:border-[var(--border)] text-white disabled:opacity-50" """
    )
]

for target, replacement in replacements:
    if target in content:
        content = content.replace(target, replacement)
    else:
        print(f"Warning: target not found!\n{target[:50]}...")

with open(file_path, "w") as f:
    f.write(content)

print("Conflicts merged successfully.")

