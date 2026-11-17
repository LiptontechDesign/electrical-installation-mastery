# Solar PV design, installation and commissioning

**Final viewing order · 72 videos**

Use the numbered links in order. The EDWartens topics provide the framework. Where one topic depends on another, the individual videos move to the point where that knowledge is needed. Each video has a note explaining what to take from it. Keep the same practice project from the first PVGIS estimate through handover. [EDWartens course](https://edwartens.co.uk/student/courses/rooftop-solar-pv-design-installation)

The archive supplied 70 transcript files. I compared transcript passages from across each available video and read selected transcripts in more detail where the placement or technical interpretation needed checking. Two videos have no captions and are marked as title-based placements. The Open Green Energy video has unreliable automatic captions, supplemented by the creator’s illustrated project. [Open Green Energy project](https://www.opengreenenergy.com/diy-off-grid-solar-system-v2-0-2/)

## Before video 1

Practise polarity, voltage, current, resistance, Ohm’s law and series/parallel circuits. Distinguish W from Wh, Ah from Wh, and AC real power (W) from apparent power (VA). Work a basic circuit problem on paper and learn meter selection and safe measurement on a supervised practice setup. The video collection assumes some of these skills. [OpenStax physics review](https://openstax.org/books/physics/pages/19-section-summary)

## 1. Solar resource and PVGIS · EDWartens 1

Learn to distinguish W/m², kWh/m² and kWh. Carry one site through the rest of the course: record coordinates, tilt, orientation and the lowest production months during the intended operating season.

1. [Module 14 – Solar Radiation and Solar Path | I-SED Training and Learning](https://www.youtube.com/watch?v=SSv70imrPjs) — Solar intensity, sun path, air mass and shading explain the inputs used in the next videos.
2. [Find Out How Much Solar Power Your Home Can Generate (using the PVGIS utility)](https://www.youtube.com/watch?v=MdpQci4vTLU) — Start with a residential PVGIS walkthrough and compare monthly generation for a fixed array.
3. [Using PVGIS to Calculate Solar Yield for Renewable Energy Projects 🌍](https://www.youtube.com/watch?v=egReBSmaNCs) — Repeat the workflow at project scale and see how the horizon and assumptions affect the yield estimate.
4. [Accessing Irradiance & Temperature Data from PVGIS](https://www.youtube.com/watch?v=n7OzKgvnYVs) — Export monthly and hourly resource data. This is the preparation for a standalone sizing exercise that depends on a weak solar month.
5. [MCS compliant Solar PV Calculator](https://www.youtube.com/watch?v=65IBdi0enrE) — Reference example of MCS-style yield and shading inputs in a 2013 calculator. Treat its interface and financial assumptions as historical.

## 2. Panels, datasheets and inverter types · EDWartens 2

Read a real module datasheet. Mark Voc, Isc, Vmp, Imp, rated power and temperature coefficients. Sketch the PV, controller, battery, inverter and load blocks before choosing specific equipment.

6. [How to read a Solar Panel Technical Data Sheet Understanding IV Curves ReneSola Vitus II](https://www.youtube.com/watch?v=FSB6N5K0ydY) — Visual introduction to the I–V curve and its endpoints using a commercial module.
7. [Datasheet study](https://www.youtube.com/watch?v=6A5ffEi-fSE) — Maps the datasheet figures to the curve. Use the datasheet to resolve ambiguous caption terminology.
8. [Effect of temperature](https://www.youtube.com/watch?v=zQbPzKU4gW8) — Explains how temperature changes Voc, Isc and peak power. The worked arithmetic comes in Module 5.
9. [Protecting cells in series](https://www.youtube.com/watch?v=P6RQCxF-7DE) — Shows shaded cells becoming a load and how a bypass diode changes the combined I–V curve. Moved from the installation protection module.
10. [Module 5: Inverters and Power Conditioning Units of Solar PV: I-SED Training and Learning](https://www.youtube.com/watch?v=j0Y6xkJk6fk) — Introduces DC-to-AC conversion, MPPT, inverter types and grid synchronization. Equipment claims are checked against the equipment datasheet in the exercises.
11. [When to Use String Inverters vs. Microinverters | What's The Difference?](https://www.youtube.com/watch?v=PFTHG8Pr6ek) — Compares string inverters, optimizers and microinverters for shading and monitoring. Revisit the tradeoffs after your site survey.

## 3. Load profiles and battery fundamentals · EDWartens 3 with the sizing theory from 9

Make a 24-hour load table with AC and DC loads, daily Wh, coincident demand and starting surges. Mark essential loads and distinguish an overnight battery requirement from multi-day autonomy.

12. [PV system design - load profile](https://www.youtube.com/watch?v=gNUv5N9PsvU) — Works through a 24 V load profile with separate day and night totals. Keep the result for the battery example later in this module.
13. [How to Size your Solar Power System](https://www.youtube.com/watch?v=TJBGbufexEM) — Introduces autonomy and the relationship between battery refill time and array size through simple worked examples. Use it as a first estimate.
14. [Module 6 – Energy Storage and Control Devices (PV Technical) | I-SED Training and Learning](https://www.youtube.com/watch?v=sQs7OqIpyHA) — Introduces battery chemistry, depth of discharge, state of charge and PWM versus MPPT before the detailed sizing videos.
15. [Battery capacity](https://www.youtube.com/watch?v=aLuaL3yY6Oo) — Explains Ah ratings, C-rate and how discharge rate affects available capacity.
16. [PV system design - battery sizing](https://www.youtube.com/watch?v=oGq6I0D1kGM) — Returns to the day/night example from video 12 and sizes battery capacity against energy and current requirements. The worked battery assumptions belong to that example.

## 4. Site survey, shading and roof constraints · EDWartens 4

Build a site brief with usable roof area, obstructions, orientation, cable routes, mounting limits and available space for the equipment. Use the brief to update your PVGIS estimate before sizing strings.

17. [Work at Height | Working On or Near Roofs (HSE UK)](https://www.youtube.com/watch?v=nuuijzPhqQA) — Title-based placement. Working-at-height preparation comes before practical roof survey or installation videos.
18. [How to Perform a Solar Site Survey](https://www.youtube.com/watch?v=gv_OwtR7KEQ) — Follows a survey from an aerial sketch through roof, structure, measurements and electrical service documentation.
19. [Solmetric MCS feature](https://www.youtube.com/watch?v=fN3RSSFxKSU) — Demonstrates measured solar access and the MCS shading factor using the Solmetric tool.
20. [RE3 Guide: Fire Safety for Rooftop Solar Panels - FPA & RISCAuthority Breakdown](https://www.youtube.com/watch?v=89BPdwp5ZM0) — Adds fire and access considerations such as roof construction, cable routes, isolation and signage.

## 5. PV strings and one complete standalone calculation · EDWartens 5 and altE

First calculate a defensible string-length range by hand. Then do the six altE videos as one block with the same load schedule, recording the battery, array, controller and inverter choices. Reapply the method to your own load table and site data.

21. [What is String Sizing in PV Solar Design?](https://www.youtube.com/watch?v=8opoazXSXTM) — Defines a string and explains why cold conditions can raise its open-circuit voltage.
22. [Temperature effect calculation example](https://www.youtube.com/watch?v=jizCsQqg_OY) — Converts datasheet temperature coefficients into corrected Isc, Voc and power. This is the arithmetic bridge from Module 2 to the design examples.
23. [PV String Sizing Calculations](https://www.youtube.com/watch?v=uH_72OV-v80) — Works through hot operating-voltage and cold open-circuit limits. Verify the temperature inputs and the appropriate voltage coefficient or manufacturer method for your module.
24. [PV String Sizing Calculation | IEC 62548 Solar Design Guide](https://www.youtube.com/watch?v=3FjJ8Ozx9BQ) — Reinforces the upper and lower string-length checks in an IEC-oriented example. Compare the assumptions with video 27.
25. [6 Steps to Design a DIY Off Grid Solar Power System](https://www.youtube.com/watch?v=CHYVhNdlYM4) — Maps the full altE workflow from loads through balance-of-system equipment.
26. [Loads List: Off Grid Solar Power System Design - Step 1](https://www.youtube.com/watch?v=vdly8OhsdmI) — Begins the shared worked example by measuring energy use, identifying simultaneous loads and recording motor surges.
27. [Battery Bank Sizing: Off Grid Solar Power System Design - Step 2](https://www.youtube.com/watch?v=7ROjd6eLANo) — Uses that load list to choose battery voltage, usable energy and a bank arrangement.
28. [Solar Array Sizing: Off Grid Solar Power System Design - Step 3](https://www.youtube.com/watch?v=pJNWjtwE3XA) — Uses seasonal sun hours and losses to estimate array power and starts selecting compatible string arrangements.
29. [Solar Charge Controller: Off Grid Solar Power System Design - Step 4](https://www.youtube.com/watch?v=D0PMQX-wHjY) — Resolves the array choices through PWM/MPPT selection, cold Voc, controller output and datasheet limits.
30. [Inverters: Off Grid Solar Power System Design - Step 5](https://www.youtube.com/watch?v=I0X2YDfDaQU) — Uses the same coincident and surge loads to choose an inverter. Its North American supply examples and NEC breaker multipliers belong to their stated context.
31. [Creating residential projects in SolarEdge's Designer | International](https://www.youtube.com/watch?v=TY00oJLQFAg) — Applies roof layout, storage, auto-stringing and yield reporting in SolarEdge Designer. Compare its result with your hand calculation for the applicable equipment.

## 6. DC and AC cables · EDWartens 6

Add a circuit schedule to the single-line diagram. Document circuit current, routing and correction factors, cable ampacity and voltage drop. Carry the same schedule into the device selection lesson.

32. [Module 7 – PV System & Electrical Components | I-SED Training and Learning](https://www.youtube.com/watch?v=YybU6vzXxRk) — Introduces PV cable, connectors, DC/AC distribution boxes and the physical path from modules to loads.
33. [A basic introduction to cable sizing calculations - BS7671](https://www.youtube.com/watch?v=u8Gqg-ELF9Y) — Establishes the general relationship between design current, overcurrent device, cable capacity, derating and voltage drop.
34. [Cable Size for Solar Panels - How to Size Wire for Voltage Drop](https://www.youtube.com/watch?v=sxgntlX4EzY) — Applies voltage drop to a small PV circuit and a series-parallel array, separating string runs from the combined run.
35. [Solar PV DC Voltage Drop Calculation | IEC 62548 | IECCalc.com](https://www.youtube.com/watch?v=9GjenHkXAb4) — Deepens the calculation with loop resistance, operating temperature, voltage at the inverter and power loss.

## 7. Protection and isolation · EDWartens 7 and battery DC examples

On the same drawing identify what each device does and record its circuit, DC or AC voltage rating, current rating, breaking capacity where applicable and the equipment datasheet that supports the selection.

36. [Do you need to fit a DC isolator?| Solar Inverter Installation UK](https://www.youtube.com/watch?v=2BBCclJuM4I) — Explains built-in and external DC isolation in context, including the limits of AC-side isolation with a hybrid inverter.
37. [DON'T Install DC Isolators On Solar, Electricians Warned](https://www.youtube.com/watch?v=Wnroz4Mvfbg) — Use the solar item at the beginning as a follow-up to the detailed isolator lesson. The headline is broader than the segment and the rest is general trade news.
38. [What is a Surge Protection Device (SPD)? and How Do They Work?](https://www.youtube.com/watch?v=7en_Rc14c2g) — Explains transient overvoltage and the purpose of an SPD.
39. [ElectricalOM Webinar - Solar PV Design based on BS 7671 Section 712](https://www.youtube.com/watch?v=h_tOtjDDOso) — Applies UK-oriented design checks in ElectricalOM, including reverse current in parallel strings and when protection changes with the array configuration.
40. [How To Size 12V/48V Fuses and Cables: Beginner Friendly](https://www.youtube.com/watch?v=YlsnpoiWNpU) — Shows a manual-based starting point for terminal hardware, torque and DC fuse voltage, with equipment-specific examples.
41. [EASY! The ONLY Video You Need to Understand Cable & Fuse Sizing! (DIY Solar)](https://www.youtube.com/watch?v=2aWYl4T9p3s) — Use the busbar, disconnect and fuse discussion as an exercise in checking a DIY design. Check every rating independently. Its percentage rules are specific shortcuts.

Read the sections on DC wiring, fuse voltage and interrupt ratings before completing your device schedule. [Victron Wiring Unlimited](https://www.victronenergy.com/blog/2019/09/03/wiring-unlimited/)

## 8. Earthing, bonding and lightning · EDWartens 8

Draw the supply and equipment earthing arrangements for the architecture under study. Explain what changes in island mode before studying the transfer and backup examples.

42. [PNB & PME DIFFERENCES – EARTHING SYSTEMS - BS7671 AMENDMENT 4 – MUST KNOW – WITH QUESTIONS & ANSWERS](https://www.youtube.com/watch?v=xGkmAAiubVs) — Introduces UK supply earthing terminology and compares PNB and PME with diagrams and questions.
43. [In-Depth: Earthing and Bonding of Solar Inverters. Why?](https://www.youtube.com/watch?v=RXInP4XerlE) — Explains the purpose of a neutral-earth reference and the fault path in an inverter-supplied installation. Apply the equipment-specific switching and bonding scheme.
44. [Lightning & Surge Protection: Course Photovoltaics #28](https://www.youtube.com/watch?v=9LL2DIbFNNM) — Connects lightning paths, separation, bonding and SPD types to PV layout. The code examples are German.

## 9. Hybrid batteries, backup circuits and equipment · EDWartens 9

Use the sizing work from Modules 3 and 5 to specify usable kWh, required kW, backup circuits and the battery–inverter combination. Distinguish the AC-coupled equipment shown here from the DC-coupled standalone design.

45. [IET Wiring Regulations BS7671 Amendment 4: Stationary Secondary Batteries Explained](https://www.youtube.com/watch?v=z70Dh5WXt1s) — A short IET introduction to stationary battery requirements, useful as a pointer to the standards rather than a design walkthrough.
46. [Solar Wiring Walkthrough: GivEnergy All-in-One Battery and Gateway with SolarEdge Inverter](https://www.youtube.com/watch?v=0g60g5OHt9s) — Traces a specific GivEnergy gateway, its bypass, backed-up loads and AC-coupled battery and PV equipment. Treat the older second battery and automation as features of this particular home.

## 10. Grid interaction, grid backup and no export · EDWartens 10

Draw two concepts for comparison: a transfer-based import-only arrangement and a grid-parallel hybrid with export control. Identify the equipment and utility requirements for the one you choose. Write down which loads are supplied in each mode.

47. [Photovoltaic Self-Consumption: The 5 Most Frequently Asked Questions | Schneider Electric](https://www.youtube.com/watch?v=Eg4uiW23XrU) — Introduces grid-parallel self-consumption, simultaneous grid support and ordinary grid-tie behavior during outages.
48. [Photovoltaic Self-Consumption: 4 Ways to Manage Excess PV Production | Schneider Electric](https://www.youtube.com/watch?v=UBcvB6lXvcE) — Builds on that example by separating export, curtailment, battery storage and load shifting. This is the conceptual lead-in to no export.
49. [Grid connection principle](https://www.youtube.com/watch?v=4FW-Im5QDl0) — Adds the electrical model behind synchronization and controlled grid current. Its AC waveform and inductance detail follows the plain-language videos.
50. [DNO Approval Explained for Solar & Home Batteries | G98 vs G99](https://www.youtube.com/watch?v=r81noNZS56g) — Introduces the UK distribution operator workflow and why PV plus storage changes the connection discussion.
51. [Avoid solar PV project delays: How to use the ENA Connect Direct Register (G98, G99, G100 Explained)](https://www.youtube.com/watch?v=L9GREd4LAVE) — Demonstrates the UK equipment register and distinguishes connection requirements from export limitation.
52. [Getting Your DNO G98 & G99 Applications Correct !](https://www.youtube.com/watch?v=el-AwsrjijM) — Shows UK application and notification mistakes, including equipment changes and incomplete project closeout.
53. [PART P WHAT IS IT? The Building Regulations and Approved Document P.](https://www.youtube.com/watch?v=mX_BZynfUdg) — Explains Part P building-regulation context. Placed before work starts so you encounter the jurisdiction-specific requirements during planning.

For your solar-first, grid-backup project, document the behavior for strong sun with a full battery, weak sun, low battery, grid loss and grid restoration. Include where import/export is measured, which circuits stay powered and how you will verify export control. The Victron example requires compatible equipment and its own design and commissioning procedures. [ESS design](https://www.victronenergy.com/media/pg/Energy_Storage_System/en/system-design.html) · [ESS configuration](https://www.victronenergy.com/media/pg/Energy_Storage_System/en/configuration.html) · [ESS commissioning](https://www.victronenergy.com/media/pg/Energy_Storage_System/en/commissioning.html)

## 11. Installation and physical connections · EDWartens 11 with worked examples

Review the working-at-height video from Module 4. Use your single-line diagram to trace isolation points, conductor routes and equipment connections in each case, from a small system to a larger installation.

54. [Module 13 – PV Installation & Operations | I-SED Training and Learning](https://www.youtube.com/watch?v=lMONO8yH92o) — Gives installation and quality-control context across standalone, rooftop and larger PV systems.
55. [Solar Panels for Beginners: Build Your First Solar Power System](https://www.youtube.com/watch?v=uobUwjCLfok) — A small kit makes the component paths easy to see. Observe the layout and avoid replicating the spark demonstration or copying its fuse sizes.
56. [Ultimate Guide to Install an Off-Grid Solar System | Step By Step Off-Grid Solar System Sizing](https://www.youtube.com/watch?v=X_0AecD6E1M) — A second standalone design and wiring example. The automatic captions are unreliable, so placement also uses the title and the creator’s illustrated project.
57. [Overview of OFF GRID SOLAR POWER SYSTEM UK: VICTRON and PYLONTECH DIY OFF-GRID SET UP](https://www.youtube.com/watch?v=YRn9xabVIQM) — Tours a larger UK off-grid system with Victron, Pylontech and generator backup. Follow the overall topology before inspecting the build.
58. [OFF GRID SOLAR SYSTEM INSTALLATION: Wiring VICTRON Quattro 48V 10,000 inverter, MPPTs and Cerbo GX](https://www.youtube.com/watch?v=T5aVFo7EUi8) — Shows the same project in more physical detail, including busbars, MPPTs, inverter wiring and monitoring. This is a DIY case study.
59. [Installing Solar Panels on a UK roof – Full Walkthrough](https://www.youtube.com/watch?v=C-PEn_VcGqA) — Title-based placement. Watch the UK roof installation walkthrough before comparing a specific integrated mounting method.
60. [How to Install In-Roof Solar](https://www.youtube.com/watch?v=a9m84hM7pFw) — Shows the sequence for a particular in-roof mounting and flashing kit. Moved from surveying to installation.
61. [5 MISTAKES to avoid when installing Solar ❌](https://www.youtube.com/watch?v=jUehMdNfGrY) — Closes with a real inspection case involving workmanship, labelling and roof penetrations. Turn the examples into a visual inspection checklist.

## 12. Testing, troubleshooting and handover · EDWartens 12

Draft an inspection, test and handover record. List expected values or behavior, actual results, pass criteria and corrective action. Use a qualified supervisor and appropriately rated equipment for physical practice.

62. [How NOT to Test Your Solar Installation! - PV Checks](https://www.youtube.com/watch?v=yiuZkfuwzPs) — Start with the overall PV test sequence and a dedicated PV tester demonstration. This gives the purpose and relationship of the individual tests.
63. [Solar PV Testing with Chris Kitcher 'Open Circuit Test' 🌞😎 Episode 2](https://www.youtube.com/watch?v=lmEXjDjKfb0) — Studies the open-circuit voltage test on two different string lengths and comparison with the datasheet. Observe the method with the applicable test and equipment guidance.
64. [Solar PV insulation resistance test with Chris Kitcher. 🌞😎](https://www.youtube.com/watch?v=RMj3jiFI75U) — Studies insulation resistance and why an isolated inverter can still have live PV wiring upstream.
65. [Troubleshooting a Solar Charge Controller](https://www.youtube.com/watch?v=j5xf638xNw8) — Works through a missing-current fault on a small PWM demo system. Use the reasoning, and confirm units and method independently before any practical work.
66. [Completing the Solar PV Handover Certificate](https://www.youtube.com/watch?v=7Gl7TGBqlKs) — Closes with the handover record, equipment and inspection references, and battery/island-mode details.

## 13. Operation, yield and economics · EDWartens 13

Compare predicted and observed energy, set up a basic maintenance log, and estimate payback with export revenue set to zero for your project.

67. [Module 11 – Protection and Maintenance of PV Systems | I-SED Training and Learning](https://www.youtube.com/watch?v=Qsd9U3ZlWA4) — Introduces preventive, corrective and predictive maintenance and an inspection and monitoring routine.
68. [Solar Energy. 9 Performance Ratio](https://www.youtube.com/watch?v=O9WDHspizHA) — Defines specific yield and performance ratio before examining weather and measurement effects.
69. [PV System Yield: Course Photovoltaics #36](https://www.youtube.com/watch?v=RIboAHwalPg) — Explains where predicted yield losses come from, including shading, optical and electrical losses, and temperature.
70. [Solar and Battery Payback Calculator - with real data! How long does it take to get your money back?](https://www.youtube.com/watch?v=hbXD5GEh7W4) — Uses a year of metered import, household demand and generation data to build a payback model. Replace the assumptions with your own.
71. [What is the Smart Export Guarantee (SEG)?](https://www.youtube.com/watch?v=4S5-XtRJ9f4) — Explains the UK export-payment scheme as optional background after the technical design and the no-export business case.
72. [What are the best UK solar export tariffs? (August 2026)](https://www.youtube.com/watch?v=WPL8lIZkOQY) — Illustrates tariff comparisons using an August 2026 snapshot. Keep it as a dated example of the economics of an exporting system.

## Final design exercise

Start with the load schedule and the site data. Produce the battery and PV sizing calculations, equipment selections, string checks, a single-line diagram, cable and protection schedules, the grid/battery operating sequence, and a commissioning and handover record. First complete the standalone design, then revise it for solar-first operation with utility backup and your no-export requirement. [GSES off-grid design guide](https://www.gsesinternational.com/wp-content/uploads/2021/04/Off-Grid-Design-Guidelines-V3.1-July-2019.pdf)

The integrated sequence still needs separate practice in fault-current calculations and protective-device coordination, three-phase commercial design, and hands-on installation and commissioning. The videos demonstrate pieces of those skills. Verify the complete protection and no-export design for the selected equipment as a separate exercise.
