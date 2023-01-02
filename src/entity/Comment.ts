import {BeforeInsert, Column, Entity, Index, ManyToOne, OneToMany} from "typeorm";
import BaseEntity from "./Entity"
import {User} from "./User";
import {JoinColumn} from "typeorm/browser";
import {Exclude, Expose} from "class-transformer";
import Vote from "./Vote";
import Post from "./Post";
import {makeId} from "../utils/helper";

@Entity("comment")
export default class Comment extends BaseEntity {
    @Index()
    @Column()
    identifier: string;

    @Column()
    body: string;

    @Column()
    username: string;

    @ManyToOne(() => User)
    @JoinColumn({name: "username", referencedColumnName: "username"})
    user: User;

    @Column()
    postId: number;

    @ManyToOne(() => Post, (post) => post.comments, {nullable: false})
    post: Post;

    @Exclude()
    @OneToMany(() => Vote, (vote) => vote.comment)
    votes: Vote[];

    protected userVote: number;

    @Expose() get voteScore(): number {
        const initialValue = 0;
        return this.votes?.reduce((previousValue, currentObject) =>
            previousValue + (currentObject.value || 0), initialValue);
    }

    setUserVote(user: User): void {
        const index: number = this.votes?.findIndex(v => v.username === user.username)
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }

    @BeforeInsert()
    makeId(): void {
        this.identifier = makeId(8)
    }
};
