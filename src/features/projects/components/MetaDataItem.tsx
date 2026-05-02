type MetaDataItemProps = {
  label: string;
  value?: string | number | null;
};

/** Read-only metadata row: plain label + value (no borders or input-style fills). */
const MetaDataItem = ({ label, value }: MetaDataItemProps) => (
  <div>
    <p className="text-xs font-medium text-gray-600 dark:text-gray-300">{label}</p>
    <p className="mt-1 text-sm font-semibold leading-snug text-gray-950 dark:text-gray-50">
      {value ?? "—"}
    </p>
  </div>
);

export default MetaDataItem;
