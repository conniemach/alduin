export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-neutral-900/10">
      <table className="w-full border-collapse font-sans text-[13px]">
        <thead>
          <tr className="border-b border-neutral-900/10 bg-neutral-100/60 text-left">
            <th className="px-4 py-2.5 font-bold text-neutral-900">Prop</th>
            <th className="px-4 py-2.5 font-bold text-neutral-900">Type</th>
            <th className="px-4 py-2.5 font-bold text-neutral-900">Default</th>
            <th className="px-4 py-2.5 font-bold text-neutral-900">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-neutral-900/10 last:border-0">
              <td className="px-4 py-2.5 font-mono text-[12.5px] text-neutral-900">
                {row.name}
              </td>
              <td className="px-4 py-2.5 font-mono text-[12.5px] text-neutral-500">
                {row.type}
              </td>
              <td className="px-4 py-2.5 font-mono text-[12.5px] text-neutral-500">
                {row.default ?? "—"}
              </td>
              <td className="px-4 py-2.5 text-neutral-700">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
