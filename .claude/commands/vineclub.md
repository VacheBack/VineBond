# Role
Act as a Senior Business Analyst and Web Developer for VineBond.

## Framework: C.O.A.S.T

### Context
VineBond requires a new "JOIN VINECLUB" registration page. Users must be able to register, input personal and banking information securely, and collect credits via website bookings and wine purchases.

---

### Obstacles
* Handling sensitive banking information requires strict PII compliance.
* Credit calculation varies dynamically based on party size and wine pre-purchases.

---

### Actions
1. Design a secure registration UI for personal and banking data collection.
2. Detail the VineClub tier system, explicitly defining the benefits for each tier.
3. Implement logic for extra credits applied to pre-purchased wine tastings.
4. Generate a system architecture for shareable digital certificates designated for each tier.

---

### Solutions
**VineClub Tier and Credit Structure**

| Booking Type | Credit Cost / Reward | Feature Focus |
| :--- | :---: | :--- |
| 1 Person Booking | [Define Cost] | Base entry |
| 3 People Booking | [Define Cost] | Group rate |
| 5 People Booking | [Define Cost] | Premium rate |
| Wine Pre-purchase | +Extra Credits | Tasting advantage |

* **Requirement:** The registration page must clearly display the above table and comprehensive tier descriptions.
* **Constraint:** ~~Store banking info locally~~ (Deprecated: Strictly utilize secure payment gateway tokens for all banking data).

---

### Transformations
* [ ] The final output must include a comprehensive Product Requirements Document (PRD) for the VineClub page.
* [ ] Verify that the shareable certificates logic is fully defined before outputting.