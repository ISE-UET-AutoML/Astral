type MetaDataItemProps = {
  label: string;
  value?: string | number | null;
};

const MetaDataItem = ({ label, value }: MetaDataItemProps) => (
  <div className="flex flex-col space-y-0.5 rounded-xl border border-gray-100 bg-gray-50/60 px-3.5 py-3 transition-colors duration-150 hover:bg-gray-100/70 dark:border-white/8 dark:bg-white/[0.03] dark:hover:bg-white/[0.06]">
    <span className="text-[10px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500">
      {label}
    </span>
    <span className="text-sm font-semibold leading-snug text-gray-900 dark:text-white">
      {value ?? "—"}
    </span>
  </div>
);

export default MetaDataItem;
