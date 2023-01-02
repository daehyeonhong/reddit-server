import {BeforeInsert, Column, Entity, Index, ManyToOne, OneToMany} from "typeorm";
import BaseEntity from "./Entity"
import {User} from "./User";
import Comment from "./Comment";
import {JoinColumn} from "typeorm/browser";
import Sub from "./Sub";
import {Exclude, Expose} from "class-transformer";
import {makeId, slugify} from "../utils/helper";
import Vote from "./Vote";

@Entity("post")
export default class Post extends BaseEntity {
    @Index()
    @Column()
    identifier: string;

    @Column()
    title: string;

    @Index()
    @Column()
    slug: string;

    @Column({nullable: true, type: "text"})
    body: string;

    @Column()
    subName: string;

    @Column()
    username: string;

    @ManyToOne(() => User, (user) => user.posts)
    @JoinColumn({name: "username", referencedColumnName: "username"})
    user: User;

    @ManyToOne(() => Sub, (sub) => sub.posts)
    @JoinColumn({name: "subName", referencedColumnName: "name"})
    sub: Sub;

    @Exclude()
    @OneToMany(() => Comment, (comment) => comment.post)
    comments: Comment[];

    @Exclude()
    @OneToMany(() => Vote, (vote) => vote.post)
    votes: Vote[];

    @Expose() get url(): string {
        return `r/${this.subName}/${this.identifier}/${this.slug}`
    }

    @Expose() get commentCount(): number {
        return this.comments?.length;
    }

    @Expose() get voteScore(): number {
        return this.votes?.reduce((memo, curt) => memo + (curt.value || 0), 0);
    }

    protected userVote: number

    setUserVote(user: User): void {
        const index = this.votes?.findIndex(v => v.username === user.username);
        this.userVote = index > -1 ? this.votes[index].value : 0;
    }

    @BeforeInsert()
    makeIdAndSlug(): void {
        this.identifier = makeId(7);
        this.slug = slugify(this.title);
    }
};
