import React from 'react'
import { Pagination } from 'antd'
import './MoviePagination.css'

function MoviePagination({ total, pageSize, currentPage, onPageChange }) {

    const pageChangePagination = (page) => {
        onPageChange(page)
      }
    
    return(
        <div className='movie-pagination'>
            <Pagination  total={total}
            pageSize={pageSize}
            currentPage={currentPage}
            onChange={pageChangePagination}
            showSizeChanger={false}
            showQuickJumper={false}
             />
        </div>
    )
}

export default MoviePagination