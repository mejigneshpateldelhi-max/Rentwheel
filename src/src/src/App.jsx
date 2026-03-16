import { useState, useEffect } from "react";

const SAMPLE_VEHICLES = [];

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
const DAYS_OF_WEEK = ["Su","Mo","Tu","We","Th","Fr","Sa"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year, month) {
  return new Date(year, month, 1).getDay();
}

function CalendarPicker({ availableDays, onToggle, year, month }) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDay(year, month);
  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  return (
    <div style={{ fontFamily: "'Sora', sans-serif" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginBottom: 4 }}>
        {DAYS_OF_WEEK.map(d => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, color: "#888", fontWeight: 700, padding: "4px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
        {cells.map((day, i) => {
          if (!day) return <div key={i} />;
          const dateKey = `${year}-${month + 1}-${day}`;
          const isAvail = availableDays.includes(dateKey);
          const today = new Date();
          const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          return (
            <button
              key={i}
              onClick={() => !isPast && onToggle(dateKey)}
              style={{
                padding: "8px 0",
                borderRadius: 8,
                border: isAvail ? "2px solid #f97316" : "2px solid transparent",
                background: isAvail ? "#fff7ed" : isPast ? "#f3f4f6" : "#f9fafb",
                color: isPast ? "#ccc" : isAvail ? "#f97316" : "#374151",
                fontWeight: isAvail ? 700 : 400,
                cursor: isPast ? "not-allowed" : "pointer",
                fontSize: 13,
                transition: "all 0.15s",
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("browse"); // browse | add | book
  const [vehicles, setVehicles] = useState(SAMPLE_VEHICLES);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [bookingDay, setBookingDay] = useState(null);
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookings, setBookings] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  // Add vehicle form state
  const [form, setForm] = useState({ name: "", type: "Car", brand: "", model: "", price: "", city: "", desc: "", color: "#f97316", availableDays: [] });
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  // Browse filter
  const [filterType, setFilterType] = useState("All");
  const [filterCity, setFilterCity] = useState("");

  // View mode for browse
  const [viewVehicle, setViewVehicle] = useState(null);

  const toggleDay = (dateKey) => {
    setForm(f => ({
      ...f,
      availableDays: f.availableDays.includes(dateKey)
        ? f.availableDays.filter(d => d !== dateKey)
        : [...f.availableDays, dateKey]
    }));
  };

  const handleAddVehicle = () => {
    if (!form.name || !form.brand || !form.model || !form.price || !form.city) {
      alert("Please fill in all required fields.");
      return;
    }
    const vehicle = {
      id: Date.now(),
      ...form,
      price: Number(form.price),
      owner: form.name,
      emoji: form.type === "Car" ? "🚗" : "🏍️",
    };
    setVehicles(v => [...v, vehicle]);
    setForm({ name: "", type: "Car", brand: "", model: "", price: "", city: "", desc: "", color: "#f97316", availableDays: [] });
    setSuccessMsg("Vehicle listed successfully!");
    setTimeout(() => setSuccessMsg(""), 3000);
    setTab("browse");
  };

  const handleBook = () => {
    if (!bookingName || !bookingPhone || !bookingDay) {
      alert("Please fill all booking details.");
      return;
    }
    const booking = {
      id: Date.now(),
      vehicleId: viewVehicle.id,
      vehicleName: `${viewVehicle.brand} ${viewVehicle.model}`,
      date: bookingDay,
      name: bookingName,
      phone: bookingPhone,
    };
    setBookings(b => [...b, booking]);
    // Remove booked day from vehicle
    setVehicles(vs => vs.map(v =>
      v.id === viewVehicle.id
        ? { ...v, availableDays: v.availableDays.filter(d => d !== bookingDay) }
        : v
    ));
    setSuccessMsg(`Booking confirmed for ${bookingDay}! 🎉`);
    setBookingDay(null);
    setBookingName("");
    setBookingPhone("");
    setTimeout(() => setSuccessMsg(""), 4000);
    setViewVehicle(null);
    setTab("browse");
  };

  const filtered = vehicles.filter(v => {
    if (filterType !== "All" && v.type !== filterType) return false;
    if (filterCity && !v.city.toLowerCase().includes(filterCity.toLowerCase())) return false;
    return true;
  });

  const inputStyle = {
    width: "100%", padding: "10px 14px", borderRadius: 10,
    border: "1.5px solid #e5e7eb", fontSize: 14, fontFamily: "'Sora', sans-serif",
    outline: "none", boxSizing: "border-box", background: "#fafafa",
    marginBottom: 12,
  };
  const labelStyle = { fontSize: 12, fontWeight: 700, color: "#6b7280", marginBottom: 4, display: "block", textTransform: "uppercase", letterSpacing: "0.05em" };

  return (
    <div style={{ fontFamily: "'Sora', sans-serif", minHeight: "100vh", background: "linear-gradient(135deg, #fff7ed 0%, #fff 60%, #f0f9ff 100%)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "#111827", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 4px 24px rgba(0,0,0,0.15)" }}>
        <div>
          <div style={{ color: "#f97316", fontWeight: 800, fontSize: 22, letterSpacing: "-0.5px" }}>🚀 RentWheels</div>
          <div style={{ color: "#9ca3af", fontSize: 11, marginTop: 2 }}>Car & Bike Rental Platform</div>
        </div>
        {bookings.length > 0 && (
          <div style={{ background: "#f97316", color: "#fff", borderRadius: 20, padding: "4px 14px", fontSize: 12, fontWeight: 700 }}>
            {bookings.length} Booking{bookings.length > 1 ? "s" : ""}
          </div>
        )}
      </div>

      {/* Tab Nav */}
      <div style={{ display: "flex", background: "#fff", borderBottom: "2px solid #f3f4f6", padding: "0 16px" }}>
        {[
          { key: "browse", label: "🔍 Browse Vehicles" },
          { key: "add", label: "➕ List My Vehicle" },
          { key: "mybookings", label: "📋 My Bookings" },
        ].map(t => (
          <button
            key={t.key}
            onClick={() => { setTab(t.key); setViewVehicle(null); }}
            style={{
              padding: "14px 18px", border: "none", background: "none", cursor: "pointer",
              fontWeight: tab === t.key ? 700 : 500,
              color: tab === t.key ? "#f97316" : "#6b7280",
              borderBottom: tab === t.key ? "3px solid #f97316" : "3px solid transparent",
              fontSize: 13, fontFamily: "'Sora', sans-serif",
              transition: "all 0.2s",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {successMsg && (
        <div style={{ background: "#dcfce7", color: "#16a34a", padding: "12px 24px", fontWeight: 700, fontSize: 14, textAlign: "center" }}>
          ✅ {successMsg}
        </div>
      )}

      <div style={{ maxWidth: 680, margin: "0 auto", padding: "20px 16px" }}>

        {/* ===== BROWSE TAB ===== */}
        {tab === "browse" && !viewVehicle && (
          <div>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: "#111827", marginBottom: 4 }}>Available Vehicles</h2>
              <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Choose a vehicle and book for any available date</p>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16, flexWrap: "wrap" }}>
              {["All", "Car", "Bike"].map(f => (
                <button key={f} onClick={() => setFilterType(f)} style={{
                  padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer",
                  background: filterType === f ? "#f97316" : "#f3f4f6",
                  color: filterType === f ? "#fff" : "#374151",
                  fontWeight: filterType === f ? 700 : 500, fontSize: 13, fontFamily: "'Sora', sans-serif",
                }}>
                  {f === "Car" ? "🚗 Cars" : f === "Bike" ? "🏍️ Bikes" : "🔍 All"}
                </button>
              ))}
              <input
                placeholder="Filter by city..."
                value={filterCity}
                onChange={e => setFilterCity(e.target.value)}
                style={{ ...inputStyle, marginBottom: 0, flex: 1, minWidth: 120, padding: "6px 14px" }}
              />
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>🚗</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>No vehicles listed yet</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Be the first to list your vehicle!</div>
                <button onClick={() => setTab("add")} style={{
                  marginTop: 16, background: "#f97316", color: "#fff", border: "none",
                  padding: "10px 24px", borderRadius: 10, fontWeight: 700, cursor: "pointer",
                  fontSize: 14, fontFamily: "'Sora', sans-serif"
                }}>+ List Vehicle</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {filtered.map(v => (
                  <div key={v.id} onClick={() => setViewVehicle(v)} style={{
                    background: "#fff", borderRadius: 16, padding: 18,
                    boxShadow: "0 2px 16px rgba(0,0,0,0.07)", cursor: "pointer",
                    border: "2px solid transparent",
                    transition: "all 0.2s",
                    display: "flex", gap: 16, alignItems: "center",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#f97316"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "transparent"}
                  >
                    <div style={{
                      width: 64, height: 64, borderRadius: 14,
                      background: `linear-gradient(135deg, ${v.color}22, ${v.color}44)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 32, flexShrink: 0,
                    }}>{v.emoji}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 800, fontSize: 16, color: "#111827" }}>{v.brand} {v.model}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>By {v.owner} · {v.city}</div>
                      {v.desc && <div style={{ fontSize: 12, color: "#9ca3af", marginTop: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.desc}</div>}
                      <div style={{ marginTop: 8, display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ background: "#f97316", color: "#fff", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 700 }}>₹{v.price}/day</span>
                        <span style={{ background: "#f0fdf4", color: "#16a34a", borderRadius: 8, padding: "3px 10px", fontSize: 12, fontWeight: 600 }}>{v.availableDays.length} days free</span>
                        <span style={{ background: "#f3f4f6", color: "#6b7280", borderRadius: 8, padding: "3px 10px", fontSize: 11 }}>{v.type}</span>
                      </div>
                    </div>
                    <div style={{ color: "#d1d5db", fontSize: 20 }}>›</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== VEHICLE DETAIL / BOOK ===== */}
        {tab === "browse" && viewVehicle && (
          <div>
            <button onClick={() => { setViewVehicle(null); setBookingDay(null); }} style={{
              background: "none", border: "none", cursor: "pointer", color: "#f97316",
              fontWeight: 700, fontSize: 14, marginBottom: 16, fontFamily: "'Sora', sans-serif",
              display: "flex", alignItems: "center", gap: 6, padding: 0,
            }}>← Back to Browse</button>

            <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.08)", marginBottom: 20 }}>
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 18,
                  background: `linear-gradient(135deg, ${viewVehicle.color}33, ${viewVehicle.color}66)`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40,
                }}>{viewVehicle.emoji}</div>
                <div>
                  <h2 style={{ margin: 0, fontWeight: 800, fontSize: 20, color: "#111827" }}>{viewVehicle.brand} {viewVehicle.model}</h2>
                  <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>Owner: {viewVehicle.owner} · {viewVehicle.city}</div>
                  {viewVehicle.desc && <div style={{ color: "#9ca3af", fontSize: 13, marginTop: 6 }}>{viewVehicle.desc}</div>}
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <span style={{ background: "#f97316", color: "#fff", borderRadius: 8, padding: "4px 12px", fontWeight: 700, fontSize: 14 }}>₹{viewVehicle.price}/day</span>
                    <span style={{ background: "#f3f4f6", color: "#6b7280", borderRadius: 8, padding: "4px 12px", fontSize: 13 }}>{viewVehicle.type}</span>
                  </div>
                </div>
              </div>

              <hr style={{ border: "none", borderTop: "1.5px solid #f3f4f6", marginBottom: 18 }} />

              <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, color: "#374151" }}>📅 Available Dates — Select to Book</h3>
              {viewVehicle.availableDays.length === 0 ? (
                <div style={{ textAlign: "center", color: "#9ca3af", padding: "20px 0" }}>No available dates currently.</div>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {[...viewVehicle.availableDays].sort().map(d => (
                    <button key={d} onClick={() => setBookingDay(bookingDay === d ? null : d)} style={{
                      padding: "8px 16px", borderRadius: 10, cursor: "pointer",
                      border: bookingDay === d ? "2px solid #f97316" : "2px solid #e5e7eb",
                      background: bookingDay === d ? "#fff7ed" : "#fff",
                      color: bookingDay === d ? "#f97316" : "#374151",
                      fontWeight: bookingDay === d ? 700 : 500, fontSize: 13,
                      fontFamily: "'Sora', sans-serif", transition: "all 0.15s",
                    }}>
                      {d}
                    </button>
                  ))}
                </div>
              )}

              {bookingDay && (
                <div style={{ marginTop: 20, background: "#fff7ed", borderRadius: 14, padding: 18, border: "2px solid #fed7aa" }}>
                  <h4 style={{ margin: "0 0 14px", fontWeight: 700, color: "#c2410c" }}>📝 Booking for {bookingDay}</h4>
                  <label style={labelStyle}>Your Name *</label>
                  <input value={bookingName} onChange={e => setBookingName(e.target.value)} placeholder="Enter your name" style={inputStyle} />
                  <label style={labelStyle}>Phone Number *</label>
                  <input value={bookingPhone} onChange={e => setBookingPhone(e.target.value)} placeholder="Enter phone number" style={inputStyle} />
                  <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", marginBottom: 14, fontSize: 13, color: "#15803d" }}>
                    💰 Total: ₹{viewVehicle.price} for 1 day
                  </div>
                  <button onClick={handleBook} style={{
                    width: "100%", padding: "13px", borderRadius: 12, border: "none",
                    background: "#f97316", color: "#fff", fontWeight: 800, fontSize: 15,
                    cursor: "pointer", fontFamily: "'Sora', sans-serif",
                  }}>Confirm Booking ✓</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ===== ADD VEHICLE TAB ===== */}
        {tab === "add" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: "#111827", marginBottom: 4 }}>List Your Vehicle</h2>
              <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>Create your vehicle profile and set your free days</p>
            </div>

            <div style={{ background: "#fff", borderRadius: 20, padding: 24, boxShadow: "0 4px 24px rgba(0,0,0,0.07)" }}>
              <label style={labelStyle}>Your Name *</label>
              <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Owner name" style={inputStyle} />

              <label style={labelStyle}>Vehicle Type *</label>
              <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                {["Car", "Bike"].map(t => (
                  <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{
                    flex: 1, padding: "10px", borderRadius: 10, border: "none", cursor: "pointer",
                    background: form.type === t ? "#f97316" : "#f3f4f6",
                    color: form.type === t ? "#fff" : "#374151",
                    fontWeight: 700, fontSize: 14, fontFamily: "'Sora', sans-serif",
                    transition: "all 0.2s",
                  }}>
                    {t === "Car" ? "🚗 Car" : "🏍️ Bike"}
                  </button>
                ))}
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 0 }}>
                <div>
                  <label style={labelStyle}>Brand *</label>
                  <input value={form.brand} onChange={e => setForm(f => ({ ...f, brand: e.target.value }))} placeholder="e.g. Honda" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Model *</label>
                  <input value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder="e.g. City" style={inputStyle} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={labelStyle}>Price per Day (₹) *</label>
                  <input type="number" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} placeholder="e.g. 500" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>City *</label>
                  <input value={form.city} onChange={e => setForm(f => ({ ...f, city: e.target.value }))} placeholder="e.g. Delhi" style={inputStyle} />
                </div>
              </div>

              <label style={labelStyle}>Description</label>
              <input value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="AC, GPS, Fuel included, etc." style={inputStyle} />

              <label style={labelStyle}>Card Color</label>
              <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                {["#f97316", "#3b82f6", "#10b981", "#8b5cf6", "#ef4444", "#f59e0b"].map(c => (
                  <button key={c} onClick={() => setForm(f => ({ ...f, color: c }))} style={{
                    width: 32, height: 32, borderRadius: 8, background: c, border: "none", cursor: "pointer",
                    outline: form.color === c ? `3px solid ${c}` : "none",
                    outlineOffset: 2, transition: "all 0.15s",
                  }} />
                ))}
              </div>

              {/* Calendar */}
              <label style={{ ...labelStyle, marginBottom: 12 }}>Select Available Days (tap to toggle)</label>
              <div style={{ background: "#f9fafb", borderRadius: 14, padding: 16, marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <button onClick={() => {
                    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
                    else setCalMonth(m => m - 1);
                  }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280" }}>‹</button>
                  <span style={{ fontWeight: 700, color: "#374151", fontSize: 15 }}>{MONTHS[calMonth]} {calYear}</span>
                  <button onClick={() => {
                    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
                    else setCalMonth(m => m + 1);
                  }} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 18, color: "#6b7280" }}>›</button>
                </div>
                <CalendarPicker availableDays={form.availableDays} onToggle={toggleDay} year={calYear} month={calMonth} />
              </div>
              {form.availableDays.length > 0 && (
                <div style={{ background: "#f0fdf4", borderRadius: 10, padding: "10px 14px", marginBottom: 16, fontSize: 13, color: "#16a34a", fontWeight: 600 }}>
                  ✅ {form.availableDays.length} day{form.availableDays.length > 1 ? "s" : ""} selected as available
                </div>
              )}

              <button onClick={handleAddVehicle} style={{
                width: "100%", padding: "14px", borderRadius: 12, border: "none",
                background: "#111827", color: "#f97316", fontWeight: 800, fontSize: 15,
                cursor: "pointer", fontFamily: "'Sora', sans-serif", letterSpacing: "0.02em",
              }}>🚀 List Vehicle Now</button>
            </div>
          </div>
        )}

        {/* ===== MY BOOKINGS TAB ===== */}
        {tab === "mybookings" && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h2 style={{ fontWeight: 800, fontSize: 22, color: "#111827", marginBottom: 4 }}>My Bookings</h2>
              <p style={{ color: "#6b7280", fontSize: 13, margin: 0 }}>All your confirmed rentals</p>
            </div>
            {bookings.length === 0 ? (
              <div style={{ textAlign: "center", padding: "60px 0", color: "#9ca3af" }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>No bookings yet</div>
                <div style={{ fontSize: 13, marginTop: 6 }}>Browse vehicles and make your first booking!</div>
                <button onClick={() => setTab("browse")} style={{
                  marginTop: 16, background: "#f97316", color: "#fff", border: "none",
                  padding: "10px 24px", borderRadius: 10, fontWeight: 700, cursor: "pointer",
                  fontSize: 14, fontFamily: "'Sora', sans-serif"
                }}>Browse Vehicles</button>
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {bookings.map(b => (
                  <div key={b.id} style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: 15, color: "#111827" }}>{b.vehicleName}</div>
                        <div style={{ color: "#6b7280", fontSize: 13, marginTop: 4 }}>📅 {b.date}</div>
                        <div style={{ color: "#6b7280", fontSize: 13 }}>👤 {b.name} · 📞 {b.phone}</div>
                      </div>
                      <span style={{ background: "#dcfce7", color: "#16a34a", borderRadius: 8, padding: "4px 10px", fontSize: 12, fontWeight: 700 }}>Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
