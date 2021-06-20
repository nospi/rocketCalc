var RocketCalc = {

    weight: (mass, gravitationalAcceleration) => mass * gravitationalAcceleration,    // F = mg
    
    effective_exhaust_velocity: (isp, standardGravity) => isp * standardGravity, // Ve = Isp * g0 (standard gravity)

    effective_exhaust_velocity2: (specific_fuel_consumption, standardGravity) => 1.0 / (standardGravity * specific_fuel_consumption), // 1.0 / (SFC * g0) for SFC in kg/(N·s) 
    
    thrust: (effective_exhaust_velocity, mass_flow_rate) => effective_exhaust_velocity * mass_flow_rate, // T = Ve * mdot

    twr: (thrust, weight) => thrust / weight,

    deltaV: (isp, standardGravity, wetMass, dryMass) => isp * standardGravity * Math.log(wetMass / dryMass), // Tsiolkovsky's rocket equation

}

document.addEventListener('DOMContentLoaded', function() {
    
    const frm = document.getElementById("frm-calc")

    const ins = {
        isp: () => parseFloat(document.getElementById("isp").value),
        exhaustVelocity: () => parseFloat(document.getElementById("exhaustVelocity").value),
        wetMass: () => parseFloat(document.getElementById("wetMass").value),
        fuelMass: () => parseFloat(document.getElementById("fuelMass").value),
        dryMass: () => parseFloat(document.getElementById("dryMass").value),
        massFlowRate: () => parseFloat(document.getElementById("massFlowRate").value),
    }

    const outs = {
        massFraction: document.getElementById("massFraction"),
        deltaV: document.getElementById("deltaV"),
        eeV: document.getElementById("eeV"),
        thrust: document.getElementById("thrust"),
        weight: document.getElementById("weight"),
        twr: document.getElementById("twr"),
        burnTime: document.getElementById("burnTime"),
    }

    document.addEventListener('keyup', function (ev) {

        const g0 = 9.82
        
        var Isp;
        var eeV;
        var massWet;
        var massFuel;

        if (ev.target.id == "isp") {
            Isp = ins.isp()
            eeV = Isp * g0
            if (!isNaN(eeV)) document.querySelector("#exhaustVelocity").value = eeV
        } else if (ev.target.id == "exhaustVelocity") {
            eeV = ins.exhaustVelocity()
            Isp = eeV / g0
            document.querySelector("#isp").value = Isp
        } else {
            Isp = ins.isp()
            eeV = ins.exhaustVelocity()
        }

        var massDry = ins.dryMass()

        if (ev.target.id == "fuelMass" || ev.target.id == "dryMass") {
            massFuel = ins.fuelMass()
            massWet = massDry + massFuel
            document.querySelector("#wetMass").value = massWet
        } else if (ev.target.id == "wetMass") {
            massWet = ins.wetMass()
            massFuel = massWet - massDry
            document.querySelector("#fuelMass").value = massFuel
        } else {
            massFuel = ins.fuelMass()
            massDry = ins.dryMass()
            massWet = ins.wetMass()
        }

        const mdot = ins.massFlowRate()

        var massFraction = (massFuel) / massWet
        
        var thrust = eeV * mdot
        var burnTime = (massFuel) / mdot
        var weight = massWet * g0
        var twr = thrust / weight
        var deltaV = RocketCalc.deltaV(Isp, g0, massWet, massDry)

        var Fmt = new Intl.NumberFormat('en-AU', { maximumFractionDigits: 2 });
        
        outs.massFraction.innerText = Fmt.format(massFraction)
        outs.deltaV.innerText = Fmt.format(deltaV)
        outs.eeV.innerText = Fmt.format(eeV)
        outs.thrust.innerText = Fmt.format(thrust * 0.001)
        outs.twr.innerText = Fmt.format(twr)
        outs.burnTime.innerText = Fmt.format(burnTime)
        outs.weight.innerText = Fmt.format(weight * 0.001)

    })

})