import React from 'react';
import { VendorItem, Currency } from '@/lib/types/event';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Mail, CheckCircle2 } from 'lucide-react';

export function VendorDirectory({
  vendors,
  currency,
}: {
  vendors: VendorItem[];
  currency: Currency;
}) {
  return (
    <Card className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e5e5ea] pb-5">
        <div>
          <h3 className="text-lg font-bold text-[#1d1d1f]">Vendor & Partner Directory</h3>
          <p className="text-xs text-[#86868b]">
            Track verified supplier contracts, negotiated quotes, and direct liaison contacts
          </p>
        </div>
        <div className="text-[11px] text-[#555555] bg-[#f5f5f7] px-3 py-1 rounded-full border border-[#d2d2d7]">
          {vendors.filter((v) => v.status === 'Booked').length} of {vendors.length} Contracts Booked
        </div>
      </div>

      <div className="bg-[#fbfbfd] p-3 rounded-xl border border-[#e5e5ea] text-xs text-[#555555] flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#0071e3] shrink-0" />
        <span>
          CelebrationPilot AI strictly separates preliminary market estimates from verified contract quotes to prevent surprise billing.
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-[#f5f5f7] border-b border-[#e5e5ea] text-[#1d1d1f] font-semibold">
              <th className="py-2.5 px-3">Vendor / Partner</th>
              <th className="py-2.5 px-3">Service Scope</th>
              <th className="py-2.5 px-3">Estimated</th>
              <th className="py-2.5 px-3">Contract Quote</th>
              <th className="py-2.5 px-3">Status</th>
              <th className="py-2.5 px-3 text-right">Contact</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5ea]">
            {vendors.map((vendor) => (
              <tr key={vendor.id} className="hover:bg-[#fbfbfd]">
                <td className="py-3 px-3 font-semibold text-[#1d1d1f]">{vendor.name}</td>
                <td className="py-3 px-3 text-[#555555]">{vendor.service}</td>
                <td className="py-3 px-3 text-[#555555]">
                  {currency} {vendor.estimatedCost.toLocaleString()}
                </td>
                <td className="py-3 px-3 font-medium text-[#1d1d1f]">
                  {vendor.actualCost !== null ? (
                    `${currency} ${vendor.actualCost.toLocaleString()}`
                  ) : (
                    <span className="text-[#86868b] italic">Pending Quote</span>
                  )}
                </td>
                <td className="py-3 px-3">
                  <Badge
                    variant={
                      vendor.status === 'Booked'
                        ? 'green'
                        : vendor.status === 'Quoted'
                        ? 'blue'
                        : vendor.status === 'Contacted'
                        ? 'amber'
                        : 'gray'
                    }
                  >
                    {vendor.status}
                  </Badge>
                </td>
                <td className="py-3 px-3 text-right">
                  <a
                    href={`mailto:${vendor.contact}`}
                    className="inline-flex items-center gap-1 text-[#0071e3] hover:underline font-medium"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Liaison</span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
