import React from 'react';
import HelmetInstance from '../../utils/HelmetInstance';
import DefaultLayout from '../layouts/DefaultLayout';
import Comment from '../components/Comment/index';

const CommentPage: React.FC = () => {
    return (
        <DefaultLayout>
            <HelmetInstance title="Bình luận" />
            <Comment />
        </DefaultLayout>
    );
};

export default CommentPage;
