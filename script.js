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
// อ้างอิงจาก Electricity Tariff MAY 2023
// ไม่รวมอัตราค่าไฟฟ้าสำรอง
// ========================================

const tariffs = {

    // ====================================
    // ประเภท 1 บ้านอยู่อาศัย
    // ====================================

    1: {
        normal: {
            voltage: false
        },

        tou: {
            voltage: true,

            rates: {
                "22-33": {
                    peak: 5.1135,
                    offPeak: 2.6037,
                    service: 312.24
                },

                "below22": {
                    peak: 5.7982,
                    offPeak: 2.6369,
                    service: 24.62
                }
            }
        }
    },


    // ====================================
    // ประเภท 2 กิจการขนาดเล็ก
    // ====================================

    2: {

        normal: {
            voltage: true,

            rates: {

                "22-33": {
                    energy: 3.9086,
                    service: 312.24
                },

                "below22": {
                    tiered: true,
                    service: 33.29,

                    tiers: [
                        {
                            limit: 150,
                            rate: 3.2484
                        },

                        {
                            limit: 250,
                            rate: 4.2218
                        },

                        {
                            limit: Infinity,
                            rate: 4.4217
                        }
                    ]
                }
            }
        },


        tou: {
            voltage: true,

            rates: {

                "22-33": {
                    peak: 5.1135,
                    offPeak: 2.6037,
                    service: 312.24
                },

                "below22": {
                    peak: 5.7982,
                    offPeak: 2.6369,
                    service: 33.29
                }
            }
        }
    },


    // ====================================
    // ประเภท 3 กิจการขนาดกลาง
    // ====================================

    3: {

        normal: {
            voltage: true,

            demand: true,

            rates: {

                "69plus": {
                    demandRate: 175.70,
                    energy: 3.1097,
                    service: 312.24
                },

                "22-33": {
                    demandRate: 196.26,
                    energy: 3.1471,
                    service: 312.24
                },

                "below22": {
                    demandRate: 221.50,
                    energy: 3.1751,
                    service: 312.24
                }
            }
        },


        tou: {
            voltage: true,

            demand: true,

            rates: {

                "69plus": {
                    demandRate: 74.14,
                    peak: 4.1025,
                    offPeak: 2.5849,
                    service: 312.24
                },

                "22-33": {
                    demandRate: 132.93,
                    peak: 4.1839,
                    offPeak: 2.6037,
                    service: 312.24
                },

                "below22": {
                    demandRate: 210.00,
                    peak: 4.3297,
                    offPeak: 2.6369,
                    service: 312.24
                }
            }
        }
    },


    // ====================================
    // ประเภท 4 กิจการขนาดใหญ่
    // ====================================

    4: {

        tod: {
            voltage: true,

            demand: true,

            partialDemand: true,

            rates: {

                "69plus": {
                    peakDemandRate: 224.30,
                    partialDemandRate: 29.91,
                    energy: 3.1097,
                    service: 312.24
                },

                "22-33": {
                    peakDemandRate: 285.05,
                    partialDemandRate: 58.88,
                    energy: 3.1471,
                    service: 312.24
                },

                "below22": {
                    peakDemandRate: 332.71,
                    partialDemandRate: 68.22,
                    energy: 3.1751,
                    service: 312.24
                }
            }
        },


        tou: {
            voltage: true,

            demand: true,

            rates: {

                "69plus": {
                    demandRate: 74.14,
                    peak: 4.1025,
                    offPeak: 2.5849,
                    service: 312.24
                },

                "22-33": {
                    demandRate: 132.93,
                    peak: 4.1839,
                    offPeak: 2.6037,
                    service: 312.24
                },

                "below22": {
                    demandRate: 210.00,
                    peak: 4.3297,
                    offPeak: 2.6369,
                    service: 312.24
                }
            }
        }
    },


    // ====================================
    // ประเภท 5 กิจการเฉพาะอย่าง
    // ====================================

    5: {

        tou: {
            voltage: true,

            demand: true,

            rates: {

                "69plus": {
                    demandRate: 74.14,
                    peak: 4.1025,
                    offPeak: 2.5849,
                    service: 312.24
                },

                "22-33": {
                    demandRate: 132.93,
                    peak: 4.1839,
                    offPeak: 2.6037,
                    service: 312.24
                },

                "below22": {
                    demandRate: 210.00,
                    peak: 4.3297,
                    offPeak: 2.6369,
                    service: 312.24
                }
            }
        },


        normal: {
            voltage: true,

            demand: true,

            rates: {

                "69plus": {
                    demandRate: 220.56,
                    energy: 3.1097,
                    service: 312.24
                },

                "22-33": {
                    demandRate: 256.07,
                    energy: 3.1471,
                    service: 312.24
                },

                "below22": {
                    demandRate: 276.64,
                    energy: 3.1751,
                    service: 312.24
                }
            }
        }
    },


    // ====================================
    // ประเภท 6 องค์กรไม่แสวงหากำไร
    // ====================================

    6: {

        normal: {
            voltage: true,

            rates: {

                "69plus": {
                    energy: 3.4149,
                    service: 312.24
                },

                "22-33": {
                    energy: 3.5849,
                    service: 312.24
                },

                "below22": {
                    tiered: true,
                    service: 20.00,

                    tiers: [
                        {
                            limit: 10,
                            rate: 2.8013
                        },

                        {
                            limit: Infinity,
                            rate: 3.8919
                        }
                    ]
                }
            }
        },


        tou: {
            voltage: true,

            demand: true,

            rates: {

                "69plus": {
                    demandRate: 74.14,
                    peak: 4.1025,
                    offPeak: 2.5849,
                    service: 312.24
                },

                "22-33": {
                    demandRate: 132.93,
                    peak: 4.1839,
                    offPeak: 2.6037,
                    service: 312.24
                },

                "below22": {
                    demandRate: 210.00,
                    peak: 4.3297,
                    offPeak: 2.6369,
                    service: 312.24
                }
            }
        }
    },


    // ====================================
    // ประเภท 7 สูบน้ำเพื่อการเกษตร
    // ====================================

    7: {

        normal: {
            voltage: false,

            tiers: [
                {
                    limit: 100,
                    rate: 2.0889
                },

                {
                    limit: Infinity,
                    rate: 3.2405
                }
            ],

            service: 115.16
        },


        tou: {
            voltage: true,

            demand: true,

            rates: {

                "22-33": {
                    demandRate: 132.93,
                    peak: 4.1839,
                    offPeak: 2.6037,
                    service: 204.07
                },

                "below22": {
                    demandRate: 210.00,
                    peak: 4.3297,
                    offPeak: 2.6369,
                    service: 204.07
                }
            }
        }
    },


    // ====================================
    // ประเภท 8 ไฟฟ้าชั่วคราว
    // ====================================

    8: {

        normal: {
            voltage: false,

            energy: 6.8025,

            service: 0
        }
    }

};


// ========================================
// ประเภท 1 บ้านอยู่อาศัย
// ========================================

function calculateResidential(units) {

    let energyCost = 0;
    let serviceCost = 0;


    // ใช้ไม่เกิน 150 หน่วย

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

    }


    // ใช้เกิน 150 หน่วย

    else {

        serviceCost = 24.62;

        const tiers = [
            { limit: 150, rate: 3.2484 },
            { limit: 250, rate: 4.2218 },
            { limit: Infinity, rate: 4.4217 }
        ];

        energyCost = calculateTiered(units, tiers);
    }


    return {
        energyCost,
        serviceCost
    };

}


// ========================================
// คำนวณแบบขั้นบันได
// ========================================

function calculateTiered(units, tiers) {

    let remainingUnits = units;
    let cost = 0;


    for (const tier of tiers) {

        if (remainingUnits <= 0) {
            break;
        }


        const usedUnits = Math.min(
            remainingUnits,
            tier.limit
        );


        cost += usedUnits * tier.rate;

        remainingUnits -= usedUnits;
    }


    return Math.ceil(100*cost)/100;
}


// ========================================
// สร้างตัวเลือกประเภทอัตรา
// ========================================

function updateRateTypes() {

    const type = userType.value;

    const availableRates = tariffs[type];


    rateType.innerHTML = "";


    Object.keys(availableRates).forEach(rate => {

        const option = document.createElement("option");

        option.value = rate;


        if (rate === "normal") {
            option.textContent = "อัตราปกติ";
        }

        if (rate === "tou") {
            option.textContent = "TOU";
        }

        if (rate === "tod") {
            option.textContent = "TOD";
        }


        rateType.appendChild(option);

    });


    updateForm();

}


// ========================================
// อัปเดตแรงดัน
// ========================================

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


// ========================================
// อัปเดตฟอร์ม
// ========================================

function updateForm() {

    const type = userType.value;
    const rate = rateType.value;

    const config = tariffs[type][rate];


    updateVoltageOptions(config);


    // ซ่อนทั้งหมดก่อน

    peakGroup.classList.add("hidden");
    offPeakGroup.classList.add("hidden");
    demandGroup.classList.add("hidden");
    partialDemandGroup.classList.add("hidden");


    // TOU

    if (rate === "tou") {

        unitsGroup.classList.add("hidden");

        peakGroup.classList.remove("hidden");

        offPeakGroup.classList.remove("hidden");

    }

    else {

        unitsGroup.classList.remove("hidden");

    }


    // Demand

    if (config.demand) {

        demandGroup.classList.remove("hidden");

    }


    // TOD

    if (config.partialDemand) {

        partialDemandGroup.classList.remove("hidden");

    }

}


// ========================================
// ปุ่มคำนวณ
// ========================================

calculateBtn.addEventListener("click", calculateElectricity);

function calculateElectricity() {

    const type = userType.value;

    const rate = rateType.value;

    const ftRate =
        parseFloat(
            document.getElementById("ft").value
        ) || 0;


    let energyCost = 0;

    let demandCost = 0;

    let serviceCost = 0;

    let totalUnits = 0;


    // ====================================
    // ประเภท 1 บ้านอยู่อาศัย
    // ====================================

    if (type === "1" && rate === "normal") {

        const units =
            parseFloat(
                document.getElementById("units").value
            ) || 0;


        totalUnits = units;


        const residential =
            calculateResidential(units);


        energyCost =
            residential.energyCost;


        serviceCost =
            residential.serviceCost;

    }


    // ====================================
    // ประเภทอื่น
    // ====================================

    else {

        const config =
            tariffs[type][rate];


        let selectedRate;


        // --------------------------------
        // ไม่มีแรงดัน
        // --------------------------------

        if (!config.voltage) {

            selectedRate = config;

        }


        // --------------------------------
        // มีแรงดัน
        // --------------------------------

        else {

            selectedRate =
                config.rates[voltage.value];

        }


        // ====================================
        // TOU
        // ====================================

        if (rate === "tou") {

            const peakUnits =
                parseFloat(
                    document.getElementById("peakUnits").value
                ) || 0;


            const offPeakUnits =
                parseFloat(
                    document.getElementById("offPeakUnits").value
                ) || 0;


            totalUnits =
                peakUnits + offPeakUnits;


            energyCost =
                (peakUnits * selectedRate.peak) +
                (offPeakUnits * selectedRate.offPeak);

        }


        // ====================================
        // TOD
        // ====================================

        else if (rate === "tod") {

            const units =
                parseFloat(
                    document.getElementById("units").value
                ) || 0;


            totalUnits = units;


            energyCost =
                units * selectedRate.energy;

        }


        // ====================================
        // Normal
        // ====================================

        else {

            const units =
                parseFloat(
                    document.getElementById("units").value
                ) || 0;


            totalUnits = units;


            if (selectedRate.tiered) {

                energyCost =
                    calculateTiered(
                        units,
                        selectedRate.tiers
                    );

            }

            else if (config.tiers) {

                energyCost =
                    calculateTiered(
                        units,
                        config.tiers
                    );

            }

            else {

                energyCost =
                    units *
                    selectedRate.energy;

            }

        }


        // ====================================
        // ค่าความต้องการไฟฟ้า
        // ====================================

        if (config.demand) {

            const demand =
                parseFloat(
                    document.getElementById("demand").value
                ) || 0;


            if (rate === "tod") {

                const partialDemand =
                    parseFloat(
                        document.getElementById("partialDemand").value
                    ) || 0;


                demandCost = Math.cost(100*(
                    (demand * selectedRate.peakDemandRate) +
                    (partialDemand * selectedRate.partialDemandRate)))/100;

            }

            else {

                demandCost = Math.ceil(100*
                    demand *
                    selectedRate.demandRate)/100;

            }

        }


        serviceCost =
            selectedRate.service ||
            config.service ||
            0;

    }


    // ========================================
    // ค่า Ft
    // ========================================

    const ftCost =
        totalUnits *
        ftRate/100);


    // ========================================
    // รวมก่อน VAT
    // ========================================

    const subtotal =
        energyCost +
        demandCost +
        serviceCost +
        ftCost;


    // ========================================
    // VAT 7%
    // ========================================

    const vat =
        subtotal * 0.07;


    // ========================================
    // รวมทั้งหมด
    // ========================================

    const total =
        subtotal +
        vat;


    // ========================================
    // แสดงผล
    // ========================================

    document.getElementById("energyCost").textContent =
        formatMoney(energyCost);


    document.getElementById("demandCost").textContent =
        formatMoney(demandCost);


    document.getElementById("serviceCost").textContent =
        formatMoney(serviceCost);


    document.getElementById("ftCost").textContent =
        formatMoney(ftCost);


    document.getElementById("subtotal").textContent =
        formatMoney(subtotal);


    document.getElementById("vat").textContent =
        formatMoney(vat);


    document.getElementById("total").textContent =
        formatMoney(total);


    // ซ่อนค่าความต้องการถ้าไม่มี

    const demandResultRow =
        document.getElementById(
            "demandResultRow"
        );


    if (demandCost === 0) {

        demandResultRow.classList.add("hidden");

    }

    else {

        demandResultRow.classList.remove("hidden");

    }


    result.classList.remove("hidden");


    result.scrollIntoView({
        behavior: "smooth"
    });

}


// ========================================
// จัดรูปแบบตัวเลขเงิน
// ========================================

function formatMoney(value) {

    return value.toLocaleString(
        "th-TH",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    ) + " บาท";

}


// ========================================
// Event Listeners
// ========================================

userType.addEventListener(
    "change",
    updateRateTypes
);


rateType.addEventListener(
    "change",
    updateForm
);


// เริ่มต้นเว็บไซต์

updateRateTypes();
