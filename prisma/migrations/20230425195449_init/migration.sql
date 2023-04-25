-- CreateTable
CREATE TABLE "departments" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(80) NOT NULL,

    CONSTRAINT "departments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(20) NOT NULL,
    "surname" VARCHAR(20) NOT NULL,
    "department_id" INTEGER NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "statements" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "amount" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "statements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "amount" INTEGER NOT NULL,
    "employee_id" INTEGER NOT NULL,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rates" (
    "date" DATE NOT NULL,
    "sign" CHAR(3) NOT NULL,
    "value" DECIMAL(20,16) NOT NULL,

    CONSTRAINT "rates_pkey" PRIMARY KEY ("date","sign")
);

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "statements" ADD CONSTRAINT "statements_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_employee_id_fkey" FOREIGN KEY ("employee_id") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
