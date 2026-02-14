import {
  AcademicCapIcon,
  BookOpenIcon,
  ChartBarIcon,
  PlayCircleIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline'

const courses = [
  {
    name: 'Getting started as an affiliate',
    description: 'Learn the basics: tracking, payouts, and best practices.',
    icon: AcademicCapIcon,
    lessons: 8,
    duration: '45 min',
    progress: 0,
  },
  {
    name: 'Scaling your campaigns',
    description: 'Advanced strategies for traffic and conversion optimization.',
    icon: ChartBarIcon,
    lessons: 12,
    duration: '1h 20 min',
    progress: 0,
  },
  {
    name: 'Compliance & policies',
    description: 'Stay within guidelines and avoid common mistakes.',
    icon: BookOpenIcon,
    lessons: 5,
    duration: '25 min',
    progress: 0,
  },
]

export default function AcademyPage() {
  return (
    <div className="relative isolate overflow-hidden pt-16 pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 flex-col items-center justify-center gap-3 text-center">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
            <AcademicCapIcon className="size-6 shrink-0" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Academy
          </h1>
          <p className="text-slate-600">
            Courses and resources to grow your affiliate business.
          </p>
        </div>
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((course) => (
            <div
              key={course.name}
              className="flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm ring-1 ring-slate-200/5"
            >
              <div className="flex items-center gap-4 border-b border-slate-100 bg-slate-50/50 p-6">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600">
                  <course.icon className="size-6" aria-hidden="true" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-slate-900">{course.name}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {course.lessons} lessons · {course.duration}
                  </p>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-6">
                <p className="text-sm text-slate-600">{course.description}</p>
                <div className="mt-4 flex-1">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-sky-500 transition-all"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
                <a
                  href="#"
                  className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-sky-600 hover:text-sky-500"
                >
                  <PlayCircleIcon className="size-5" />
                  {course.progress === 0 ? 'Start course' : 'Continue'}
                </a>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-16 rounded-2xl border border-sky-100 bg-sky-50/50 p-6">
          <div className="flex items-center gap-3">
            <TrophyIcon className="size-8 text-amber-500" aria-hidden="true" />
            <div>
              <h3 className="font-semibold text-slate-900">Certification program</h3>
              <p className="text-sm text-slate-600">
                Complete all courses and pass the assessment to earn your affiliate certification badge.
              </p>
              <a href="#" className="mt-2 inline-block text-sm font-semibold text-sky-600 hover:text-sky-500">
                Learn more →
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="absolute top-full left-0 -z-10 mt-96 origin-top-left translate-y-40 -rotate-90 transform-gpu opacity-20 blur-3xl sm:left-1/2 sm:-mt-10 sm:-ml-96 sm:translate-y-0 sm:rotate-0 sm:opacity-30"
      >
        <div
          style={{
            clipPath:
              'polygon(100% 38.5%, 82.6% 100%, 60.2% 37.7%, 52.4% 32.1%, 47.5% 41.8%, 45.2% 65.6%, 27.5% 23.4%, 0.1% 35.3%, 17.9% 0%, 27.7% 23.4%, 76.2% 2.5%, 74.2% 56%, 100% 38.5%)',
          }}
          className="aspect-1154/678 w-[288.5px] bg-linear-to-br from-sky-400 to-orange-400"
        />
      </div>
    </div>
  )
}
