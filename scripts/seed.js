const { PrismaClient } = require("@prisma/client")

const database = new PrismaClient()

async function main() {
    try {
        await database.category.createMany({
            data: [
                { name: "Computer Science" },
                { name: "Web Development" },
                { name: "Mobile Development" },
                { name: "Data Science" },
                { name: "Machine Learning" },
                { name: "Artificial Intelligence" },
                { name: "Cybersecurity" },
                { name: "Cloud Computing" },
                { name: "DevOps" },
                { name: "Blockchain" },
                { name: "Game Development" },
                { name: "UI/UX Design" },
                { name: "Digital Marketing" },
                { name: "Business" },
                { name: "Finance" },
                { name: "Trading" },
                { name: "Photography" },
                { name: "Music" },
                { name: "Health & Fitness" },
                { name: "Personal Development" },
            ],
            skipDuplicates: true,
        })

        console.log("Categories seeded successfully!")
    } catch (error) {
        console.log("Error seeding the database categories:", error)
    } finally {
        await database.$disconnect()
    }
}

main()
