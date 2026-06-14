'use client';

import React, { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { db } from '@/configs';
import { JsonForms, userResponses } from '@/configs/schema';
import { and, eq } from 'drizzle-orm';
import Link from 'next/link';
import { ArrowLeft, Users, Calendar, TrendingUp, Award } from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444', '#14b8a6'];

function StatCard({ icon: Icon, label, value, sub }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function FieldChart({ field, responses }) {
  const isChoiceField = ['select', 'radio', 'checkbox'].includes(field.fieldType);
  const isNumericField = ['rating', 'scale', 'number'].includes(field.fieldType);

  if (!isChoiceField && !isNumericField) return null;

  // Tally responses for this field
  const tally = {};
  responses.forEach((r) => {
    const val = r[field.fieldName];
    if (!val) return;
    if (Array.isArray(val)) {
      val.forEach((v) => {
        const key = typeof v === 'object' ? v.label : String(v);
        tally[key] = (tally[key] || 0) + 1;
      });
    } else {
      const key = String(val);
      tally[key] = (tally[key] || 0) + 1;
    }
  });

  const data = Object.entries(tally)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);

  if (data.length === 0) return null;

  const total = data.reduce((s, d) => s + d.count, 0);

  const usePie = isChoiceField && data.length <= 6;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h3 className="font-semibold text-gray-800 mb-1">{field.label}</h3>
      <p className="text-xs text-gray-400 mb-4">{total} response{total !== 1 ? 's' : ''}</p>

      {usePie ? (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 16, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
              <Tooltip />
              <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage({ params }) {
  const { user } = useUser();
  const [formRecord, setFormRecord] = useState(null);
  const [jsonForm, setJsonForm] = useState(null);
  const [responses, setResponses] = useState([]);
  const [timelineData, setTimelineData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && params?.formId) {
      loadData();
    }
  }, [user, params]);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch form definition
      const formResult = await db
        .select()
        .from(JsonForms)
        .where(
          and(
            eq(JsonForms.id, Number(params.formId)),
            eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)
          )
        )
        .execute();

      if (!formResult[0]) return;
      const form = formResult[0];
      setFormRecord(form);

      // Parse JSON form
      const raw = form.jsonform;
      const json = JSON.parse(raw.substring(raw.indexOf('{'), raw.lastIndexOf('}') + 1));
      setJsonForm(json);

      // Fetch responses
      const respResult = await db
        .select()
        .from(userResponses)
        .where(eq(userResponses.formRef, Number(params.formId)))
        .execute();

      const parsed = respResult.map((r) => {
        try {
          return { ...JSON.parse(r.jsonResponse), _date: r.createdAt };
        } catch {
          return { _date: r.createdAt };
        }
      });
      setResponses(parsed);

      // Build timeline: group by date, cumulative
      const countByDate = {};
      parsed.forEach((r) => {
        const d = r._date || 'Unknown';
        countByDate[d] = (countByDate[d] || 0) + 1;
      });
      const sorted = Object.entries(countByDate).sort(([a], [b]) => {
        // Try to sort by date (DD/MM/YYYY format)
        const parseDate = (s) => {
          const parts = s.split('/');
          if (parts.length === 3) return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
          return new Date(0);
        };
        return parseDate(a) - parseDate(b);
      });
      let cum = 0;
      const timeline = sorted.map(([date, count]) => {
        cum += count;
        return { date, count, total: cum };
      });
      setTimelineData(timeline);
    } catch (err) {
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  const lastResponseDate =
    responses.length > 0 ? responses[responses.length - 1]?._date || '-' : '-';

  const chartableFields = jsonForm?.formFields?.filter((f) =>
    ['select', 'radio', 'checkbox', 'rating', 'scale', 'number'].includes(f.fieldType)
  ) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!formRecord) {
    return (
      <div className="text-center py-20 text-gray-500">
        Form not found or you don't have access.
        <br />
        <Link href="/dashboard/responses" className="text-primary underline mt-2 inline-block">
          Back to responses
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/responses"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 mb-4 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Responses
        </Link>
        <h1 className="font-display font-bold text-xl text-gray-900">{jsonForm?.formTitle}</h1>
        <p className="text-gray-500 text-sm mt-1">{jsonForm?.formSubheading}</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Responses" value={responses.length} />
        <StatCard
          icon={Calendar}
          label="Last Response"
          value={lastResponseDate}
          sub="DD/MM/YYYY"
        />
        <StatCard
          icon={TrendingUp}
          label="Chartable Fields"
          value={chartableFields.length}
          sub="with visual data"
        />
        <StatCard
          icon={Award}
          label="Total Fields"
          value={jsonForm?.formFields?.length || 0}
          sub="in this form"
        />
      </div>

      {/* Timeline chart */}
      {timelineData.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <h2 className="font-semibold text-gray-800 mb-4">Response Timeline</h2>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="count"
                  name="New responses"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="total"
                  name="Cumulative"
                  stroke="#10b981"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Per-field charts */}
      {chartableFields.length > 0 ? (
        <>
          <h2 className="font-semibold text-gray-800 mb-4">Response Distribution by Field</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {chartableFields.map((field, i) => (
              <FieldChart key={i} field={field} responses={responses} />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-10 text-center text-gray-500">
          <p className="font-medium">No chartable fields</p>
          <p className="text-sm mt-1">
            Add select, radio, checkbox, rating, or scale fields to your form to see distribution charts.
          </p>
        </div>
      )}

      {responses.length === 0 && (
        <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center">
          <p className="text-amber-700 font-medium">No responses yet</p>
          <p className="text-amber-600 text-sm mt-1">
            Share your form to start collecting responses. Charts will appear here once responses come in.
          </p>
        </div>
      )}
    </div>
  );
}
