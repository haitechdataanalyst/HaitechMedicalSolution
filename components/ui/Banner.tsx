export default function Banner({ title, description }: { title: string; description: string }) {
    return (
        <section className="bg-primary-gradient relative overflow-hidden text-white">
            <div className="section-lg container">
                <div className="relative z-10 mx-auto max-w-3xl text-center">
                    <h1 className="heading-1 mb-6">{title}</h1>
                    <p className="text-body-lg text-primary-100">{description}</p>
                </div>
            </div>
            {/* Decorative elements */}
            <div className="pointer-events-none absolute right-0 bottom-0 h-full w-1/2 opacity-10 md:w-1/3">
                <svg viewBox="0 0 400 400" className="h-full w-full">
                    <circle cx="300" cy="300" r="200" fill="white" />
                </svg>
            </div>
            <div className="pointer-events-none absolute top-0 left-0 h-full w-1/3 opacity-10">
                <svg viewBox="0 0 400 400" className="h-full w-full">
                    <circle cx="100" cy="100" r="150" fill="white" />
                </svg>
            </div>
        </section>
    );
}
