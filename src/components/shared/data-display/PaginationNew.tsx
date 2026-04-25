import { ChevronLeft, ChevronRight } from 'lucide-react'

type PaginationNewProps = {
	currentPage: number
	totalPages: number
	onPageChange: (page: number) => void
}

const PaginationNew = ({ currentPage, totalPages, onPageChange }: PaginationNewProps) => {
	return (
		<div className="flex justify-center mt-2">
			{currentPage > 1 && (
				<button
					onClick={() => onPageChange(currentPage - 1)}
					className="mx-2 bg-blue-200 rounded-md text-blue-700 hover:bg-[#FFDAB9] hover:text-[#FFFFFF]"
				>
					<ChevronLeft className="mx-auto flex-shrink-0 rounded-xl w-11 h-8 p-2" />
				</button>
			)}
			<span className="px-4 mx-2 text-xl">
				Page {currentPage} of {totalPages}
			</span>
			{currentPage < totalPages && (
				<button
					onClick={() => onPageChange(currentPage + 1)}
					disabled={currentPage === totalPages}
					className="mx-2 bg-blue-200 rounded-md text-blue-700 hover:bg-[#FFDAB9] hover:text-[#FFFFFF]"
				>
					<ChevronRight className="mx-auto flex-shrink-0 rounded-xl w-11 h-8 p-2" />
				</button>
			)}
		</div>
	)
}

export default PaginationNew
