const SUPABASE_URL = 'https://bcugmikcdraozmhidlls.supabase.co';
const SUPABASE_KEY = 'sb_publishable_dVZaVIBpHtUXfkxol22KLQ_tqCpu273';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const userType = document.getElementById("userType");
const rateType = document.getElementById("rateType");
const voltage = document.getElementById("voltage");

const unitsGroup = document.getElementById("unitsGroup");
const peakGroup = document.getElementById("peakGroup");
const offPeakGroup = document.getElementById("offPeakGroup");
const demandGroup = document.getElementById("demandGroup");
const partialDemandGroup = document.getElementById("partialDemandGroup");

const calculateBtn = document.getElementById("calculateBtn");
const result = document.getElementById("result");


// ========================================
// ตารางอัตราค่าไฟ
// ========================================

const tariffs = {
    1: {
        normal: { voltage: false },
        tou: {
            voltage: true,
            rates: {
                "22-33": { peak: 5.1135, offPeak: 2.6037, service: 312.24 },
                "below22": { peak: 5.7982, offPeak: 2.6369, service: 24.62 }
            }
        }
    },
    2: {
        normal: {
            voltage: true,
            rates: {
                "22-33": { energy: 3.9086, service: 312.24 },
                "below22": {
                    tiered: true,
                    service: 33.29,
                    tiers: [
                        { limit: 150, rate: 3.2484 },
                        { limit: 250, rate: 4.2218 },
                        { limit: Infinity, rate: 4.4217 }
                    ]
                }
            }
        },
        tou: {
            voltage: true,
            rates: {
                "22-33": { peak: 5.1135, offPeak: 2.6037, service: 312.24 },
                "below22": { peak: 5.7982, offPeak: 2.6369, service: 33.29 }
            }
        }
    },
    3: {
        normal: {
            voltage: true,
            demand: true,
            rates: {
                "69plus": { demandRate: 175.70, energy: 3.1097, service: 312.24 },
                "22-33": { demandRate: 196.26, energy: 3.1471, service: 312.24 },
                "below22": { demandRate: 221.50, energy: 3.1751, service: 312.24 }
            }
        },
        tou: {
            voltage: true,
            demand: true,
            rates: {
                "69plus": { demandRate: 74.14, peak: 4.1025, offPeak: 2.5849, service: 312.24 },
                "22-33": { demandRate: 132.93, peak: 4.1839, offPeak: 2.6037, service: 312.24 },
                "below22": { demandRate: 210.00, peak: 4.3297, offPeak: 2.6369, service: 312.24 }
            }
        }
    },
    4: {
        tod: {
            voltage: true,
            demand: true,
            partialDemand: true,
            rates: {
                "69plus": { peakDemandRate: 224.30, partialDemandRate: 29.91, energy: 3.1097, service: 312.24 },
                "22-33": { peakDemandRate: 285.05, partialDemandRate: 58.88, energy: 3.1471, service: 312.24 },
                "below22": { peakDemandRate: 332.71, partialDemandRate: 68.22, energy: 3.1751, service: 312.24 }
            }
        },
        tou: {
            voltage: true,
            demand: true,
            rates: {
                "69plus": { demandRate: 74.14, peak: 4.1025, offPeak: 2.5849, service: 312.24 },
                "22-33": { demandRate: 132.93, peak: 4.1839, offPeak: 2.6037, service: 312.24 },
                "below22": { demandRate: 210.00, peak: 4.3297, offPeak: 2.6369, service: 312.24 }
            }
        }
    },
    5: {
        tou: {
            voltage: true,
            demand: true,
            rates: {
                "69plus": { demandRate: 74.14, peak: 4.1025, offPeak: 2.5849, service: 312.24 },
                "22-33": { demandRate: 132.93, peak: 4.1839, offPeak: 2.6037, service: 312.24 },
                "below22": { demandRate: 210.00, peak: 4.3297, offPeak: 2.6369, service: 312.24 }
            }
        },
        normal: {
            voltage: true,
            demand: true,
            rates: {
                "69plus": { demandRate: 220.56, energy: 3.1097, service: 312.24 },
                "22-33": { demandRate: 256.07, energy: 3.1471, service: 312.24 },
                "below22": { demandRate: 276.64, energy: 3.1751, service: 312.24 }
            }
        }
    },
    6: {
        normal: {
            voltage: true,
            rates: {
                "69plus": { energy: 3.4149, service: 312.24 },
                "22-33": { energy: 3.5849, service: 312.24 },
                "below22": {
                    tiered: true,
                    service: 20.00,
                    tiers: [
                        { limit: 10, rate: 2.8013 },
                        { limit: Infinity, rate: 3.8919 }
                    ]
                }
            }
        },
        tou: {
            voltage: true,
            demand: true,
            rates: {
                "69plus": { demandRate: 74.14, peak: 4.1025, offPeak: 2.5849, service: 312.24 },
                "22-33": { demandRate: 132.93, peak: 4.1839, offPeak: 2.6037, service: 312.24 },
                "below22": { demandRate: 210.00, peak: 4.3297, offPeak: 2.6369, service: 312.24 }
            }
        }
    },
    7: {
        normal: {
            voltage: false,
            tiers: [
                { limit: 100, rate: 2.0889 },
                { limit: Infinity, rate: 3.2405 }
            ],
            service: 115.16
        },
        tou: {
            voltage: true,
            demand: true,
            rates: {
                "22-33": { demandRate: 132.93, peak: 4.1839, offPeak: 2.6037, service: 204.07 },
                "below22": { demandRate: 210.00, peak: 4.3297, offPeak: 2.6369, service: 204.07 }
            }
        }
    },
    8: {
        normal: { voltage: false, energy: 6.8025, service: 0 }
    }
};


function calculateResidential(units) {
    let energyCost = 0;
    let serviceCost = 0;

    if (units <= 150) {
        serviceCost = 8.19;
        const tiers = [
            { limit: 15, rate: 2.3488 },
            { limit: 10, rate: 2.9882 },
            { limit: 10, rate: 3.2405 },
            { limit: 65, rate: 3.6237 },
            { limit: 50, rate: 3.7171 }
        ];
        energyCost = calculateTiered(units, tiers);
    } else {
        serviceCost = 24.62;
        const tiers = [
            { limit: 150, rate: 3.2484 },
            { limit: 250, rate: 4.2218 },
            { limit: Infinity, rate: 4.4217 }
        ];
        energyCost = calculateTiered(units, tiers);
    }

    return { energyCost, serviceCost };
}


function calculateTiered(units, tiers) {
    let remainingUnits = units;
    let cost = 0;

    for (const tier of tiers) {
        if (remainingUnits <= 0) break;
        const usedUnits = Math.min(remainingUnits, tier.limit);
        cost += usedUnits * tier.rate;
        remainingUnits -= usedUnits;
    }

    return Math.ceil(100 * cost) / 100;
}


function updateRateTypes() {
    const type = userType.value;
    const availableRates = tariffs[type];

    rateType.innerHTML = "";

    Object.keys(availableRates).forEach(rate => {
        const option = document.createElement("option");
        option.value = rate;

        if (rate === "normal") option.textContent = "อัตราปกติ";
        if (rate === "tou") option.textContent = "TOU";
        if (rate === "tod") option.textContent = "TOD";

        rateType.appendChild(option);
    });

    updateForm();
}


function updateVoltageOptions(config) {
    voltage.innerHTML = "";

    if (!config.voltage) {
        voltageGroup.classList.add("hidden");
        return;
    }

    voltageGroup.classList.remove("hidden");

    if (config.rates["69plus"]) {
        const option = document.createElement("option");
        option.value = "69plus";
        option.textContent = "ตั้งแต่ 69 kV ขึ้นไป";
        voltage.appendChild(option);
    }

    if (config.rates["22-33"]) {
        const option = document.createElement("option");
        option.value = "22-33";
        option.textContent = "22 - 33 kV";
        voltage.appendChild(option);
    }

    if (config.rates["below22"]) {
        const option = document.createElement("option");
        option.value = "below22";
        option.textContent = "ต่ำกว่า 22 kV";
        voltage.appendChild(option);
    }
}


function updateForm() {
    const type = userType.value;
    const rate = rateType.value;
    const config = tariffs[type][rate];

    updateVoltageOptions(config);

    peakGroup.classList.add("hidden");
    offPeakGroup.classList.add("hidden");
    demandGroup.classList.add("hidden");
    partialDemandGroup.classList.add("hidden");

    if (rate === "tou") {
        unitsGroup.classList.add("hidden");
        peakGroup.classList.remove("hidden");
        offPeakGroup.classList.remove("hidden");
    } else {
        unitsGroup.classList.remove("hidden");
    }

    if (config.demand) {
        demandGroup.classList.remove("hidden");
    }

    if (config.partialDemand) {
        partialDemandGroup.classList.remove("hidden");
    }
}


calculateBtn.addEventListener("click", calculateElectricity);

async function calculateElectricity() {
    const type = userType.value;
    const rate = rateType.value;
    const ftRate = parseFloat(document.getElementById("ft").value) || 0;

    let energyCost = 0;
    let demandCost = 0;
    let serviceCost = 0;
    let totalUnits = 0;

    if (type === "1" && rate === "normal") {
        const units = parseFloat(document.getElementById("units").value) || 0;
        totalUnits = units;
        const residential = calculateResidential(units);
        energyCost = residential.energyCost;
        serviceCost = residential.serviceCost;
    } else {
        const config = tariffs[type][rate];
        let selectedRate;

        if (!config.voltage) {
            selectedRate = config;
        } else {
            selectedRate = config.rates[voltage.value];
        }

        if (rate === "tou") {
            const peakUnits = parseFloat(document.getElementById("peakUnits").value) || 0;
            const offPeakUnits = parseFloat(document.getElementById("offPeakUnits").value) || 0;
            totalUnits = peakUnits + offPeakUnits;
            energyCost = (peakUnits * selectedRate.peak) + (offPeakUnits * selectedRate.offPeak);
        } else if (rate === "tod") {
            const units = parseFloat(document.getElementById("units").value) || 0;
            totalUnits = units;
            energyCost = units * selectedRate.energy;
        } else {
            const units = parseFloat(document.getElementById("units").value) || 0;
            totalUnits = units;

            if (selectedRate.tiered) {
                energyCost = calculateTiered(units, selectedRate.tiers);
            } else if (config.tiers) {
                energyCost = calculateTiered(units, config.tiers);
            } else {
                energyCost = units * selectedRate.energy;
            }
        }

        if (config.demand) {
            const demand = parseFloat(document.getElementById("demand").value) || 0;

            if (rate === "tod") {
                const partialDemand = parseFloat(document.getElementById("partialDemand").value) || 0;
                demandCost = Math.ceil(100 * ((demand * selectedRate.peakDemandRate) + (partialDemand * selectedRate.partialDemandRate))) / 100;
            } else {
                demandCost = Math.ceil(100 * demand * selectedRate.demandRate) / 100;
            }
        }

        serviceCost = selectedRate.service || config.service || 0;
    }

    const ftCost = Math.ceil(100 * (totalUnits * (ftRate / 100))) / 100;
    const subtotal = energyCost + demandCost + serviceCost + ftCost;
    const vat = Math.ceil(100 * (subtotal * 0.07)) / 100;
    const total = subtotal + vat;

    // แสดงผล
    document.getElementById("energyCost").textContent = formatMoney(energyCost);
    document.getElementById("demandCost").textContent = formatMoney(demandCost);
    document.getElementById("serviceCost").textContent = formatMoney(serviceCost);
    document.getElementById("ftCost").textContent = formatMoney(ftCost);
    document.getElementById("subtotal").textContent = formatMoney(subtotal);
    document.getElementById("vat").textContent = formatMoney(vat);
    document.getElementById("total").textContent = formatMoney(total);

    const demandResultRow = document.getElementById("demandResultRow");
    if (demandCost === 0) {
        demandResultRow.classList.add("hidden");
    } else {
        demandResultRow.classList.remove("hidden");
    }

    result.classList.remove("hidden");
    result.scrollIntoView({ behavior: "smooth" });

    // --- ส่วนจัดการ LocalStorage & Supabase ---
    const calculationData = {
        userType: type,
        rateType: rate,
        totalUnits: totalUnits,
        totalCost: total,
        created_at: new Date().toISOString()
    };

    // บันทึกลง LocalStorage
    saveToLocalStorage(calculationData);

    // บันทึกลง Supabase
    try {
        const { error } = await supabaseClient
            .from('electricity_calculations') // ชื่อ Table ใน Supabase ของคุณ
            .insert([calculationData]);

        if (error) {
            console.error('Supabase Error:', error.message);
        }
    } catch (err) {
        console.error('Network or Supabase Exception:', err);
    }
}


function saveToLocalStorage(data) {
    let history = JSON.parse(localStorage.getItem("calc_history")) || [];
    history.unshift(data); // นำข้อมูลใหม่ไว้บนสุด
    if (history.length > 5) history.pop(); // เก็บไว้แค่ 5 รายการล่าสุด
    localStorage.setItem("calc_history", JSON.stringify(history));
    renderLocalHistory();
}


function renderLocalHistory() {
    const historyContainer = document.getElementById("localHistory");
    let history = JSON.parse(localStorage.getItem("calc_history")) || [];

    if (history.length === 0) {
        historyContainer.innerHTML = "ยังไม่มีประวัติการคำนวณในเครื่องนี้";
        return;
    }

    let html = "<ul>";
    history.forEach(item => {
        let dateStr = new Date(item.created_at).toLocaleString("th-TH");
        html += `<li>ประเภท: ${item.userType} (${item.rateType}) - ใช้ ${item.totalUnits} หน่วย - <strong>${formatMoney(item.totalCost)}</strong> (${dateStr})</li>`;
    });
    html += "</ul>";
    historyContainer.innerHTML = html;
}


function formatMoney(value) {
    return value.toLocaleString("th-TH", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " บาท";
}


userType.addEventListener("change", updateRateTypes);
rateType.addEventListener("change", updateForm);

// เริ่มต้นเว็บไซต์
updateRateTypes();
renderLocalHistory();